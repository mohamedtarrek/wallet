import { useState, useEffect, createContext, useContext } from 'react'
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'
import nacl from 'tweetnacl'
import bs58 from 'bs58'

interface WalletState {
  publicKey: string | null
  balance: number | null
  connected: boolean
  connect: () => void
  disconnect: () => void
  refreshBalance: () => Promise<void>
}

const WalletStateContext = createContext<WalletState>({} as WalletState)
export const useWalletState = () => useContext(WalletStateContext)

const PHANTOM_URL = 'https://phantom.app/ul/v1/connect'

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [connected, setConnected] = useState(false)

  const [connection] = useState(
    new Connection(clusterApiUrl('devnet'), 'confirmed')
  )

  const [dappKeyPair] = useState(nacl.box.keyPair())

  // =========================
  // 🔥 RESTORE SESSION (reload fix)
  // =========================
  useEffect(() => {
    const saved = localStorage.getItem('wallet_pubkey')

    if (saved) {
      setPublicKey(saved)
      setConnected(true)

      setTimeout(() => {
        fetchBalance(saved)
      }, 500)
    }
  }, [])

  // =========================
  // 🔥 HANDLE PHANTOM REDIRECT
  // =========================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const phantomPubKey = params.get('phantom_encryption_public_key')
    const data = params.get('data')
    const nonce = params.get('nonce')

    if (!phantomPubKey || !data || !nonce) return

    try {
      const decrypted = nacl.box.open(
        bs58.decode(data),
        bs58.decode(nonce),
        bs58.decode(phantomPubKey),
        dappKeyPair.secretKey
      )

      if (!decrypted) throw new Error('Decryption failed')

      const decoded = JSON.parse(Buffer.from(decrypted).toString())
      const walletPubKey = decoded.public_key

      setPublicKey(walletPubKey)
      setConnected(true)

      localStorage.setItem('wallet_pubkey', walletPubKey)

      setTimeout(() => {
        fetchBalance(walletPubKey)
      }, 500)

      // تنظيف URL
      window.history.replaceState({}, document.title, window.location.pathname)

    } catch (err) {
      console.error('Decryption error:', err)
    }
  }, [])

  // =========================
  // 💰 FETCH BALANCE
  // =========================
  const fetchBalance = async (pubKey: string) => {
    try {
      const balanceLamports = await connection.getBalance(
        new PublicKey(pubKey)
      )
      setBalance(balanceLamports / 1e9)
    } catch (err) {
      console.error('Balance error:', err)
      setBalance(null)
    }
  }

  // =========================
  // 🚀 CONNECT (REAL PHANTOM FLOW)
  // =========================
  const connect = () => {
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: 'devnet',
      app_url: window.location.origin,
      redirect_link: window.location.href,
    })

    window.location.href = `${PHANTOM_URL}?${params.toString()}`
  }

  // =========================
  // 🔌 DISCONNECT
  // =========================
  const disconnect = () => {
    setPublicKey(null)
    setBalance(null)
    setConnected(false)
    localStorage.removeItem('wallet_pubkey')
  }

  // =========================
  // 🔄 REFRESH BALANCE
  // =========================
  const refreshBalance = async () => {
    if (publicKey) {
      await fetchBalance(publicKey)
    }
  }

  return (
    <WalletStateContext.Provider
      value={{
        publicKey,
        balance,
        connected,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletStateContext.Provider>
  )
}
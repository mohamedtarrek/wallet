import { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react'
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'
import nacl from 'tweetnacl'
import bs58 from 'bs58'

interface WalletState {
  publicKey: string | null
  balance: number | null
  connected: boolean
  connecting: boolean
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
  const [connecting, setConnecting] = useState(false)

  const [connection] = useState(
    new Connection(clusterApiUrl('devnet'), 'confirmed')
  )

  const [dappKeyPair] = useState(() => nacl.box.keyPair())
  const dappKeyPairRef = useRef(dappKeyPair)

  useEffect(() => {
    dappKeyPairRef.current = dappKeyPair
  }, [dappKeyPair])

  // =========================
  // 💰 FETCH BALANCE
  // =========================
  const fetchBalance = useCallback(async (pubKey: string) => {
    try {
      const lamports = await connection.getBalance(new PublicKey(pubKey))
      setBalance(lamports / 1e9)
    } catch (err) {
      console.error('Balance error:', err)
      setBalance(null)
    }
  }, [connection])

  // =========================
  // 🔥 RESTORE SESSION
  // =========================
  useEffect(() => {
    const saved = localStorage.getItem('wallet_pubkey')

    if (saved) {
      setPublicKey(saved)
      setConnected(true)
      fetchBalance(saved)
    }
  }, [fetchBalance])

  // =========================
  // 🔥 PHANTOM REDIRECT HANDLER (FIXED + RETRY)
  // =========================
  useEffect(() => {
    const processRedirect = () => {
      const params = new URLSearchParams(window.location.search)

      const phantomPubKey = params.get('phantom_encryption_public_key')
      const data = params.get('data')
      const nonce = params.get('nonce')

      if (!phantomPubKey || !data || !nonce) return false

      try {
        const decrypted = nacl.box.open(
          bs58.decode(data),
          bs58.decode(nonce),
          bs58.decode(phantomPubKey),
          dappKeyPairRef.current.secretKey
        )

        if (!decrypted) return false

        const decoded = JSON.parse(Buffer.from(decrypted).toString())
        const walletPubKey = decoded.public_key

        if (!walletPubKey) return false

        setPublicKey(walletPubKey)
        setConnected(true)
        setConnecting(false)

        localStorage.setItem('wallet_pubkey', walletPubKey)

        fetchBalance(walletPubKey)

        window.history.replaceState({}, document.title, window.location.pathname)

        return true
      } catch (err) {
        console.error('Redirect error:', err)
        return false
      }
    }

    // run immediately
    const success = processRedirect()

    // retry loop (important for Phantom delay)
    if (!success) {
      const interval = setInterval(() => {
        const ok = processRedirect()
        if (ok) clearInterval(interval)
      }, 300)

      return () => clearInterval(interval)
    }
  }, [fetchBalance])

  // =========================
  // 🚀 CONNECT
  // =========================
  const connect = () => {
    setConnecting(true)

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: 'devnet',
      app_url: window.location.origin,
      redirect_link: window.location.origin + window.location.pathname + '?connected=true',
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
    setConnecting(false)
    localStorage.removeItem('wallet_pubkey')
  }

  // =========================
  // 🔄 REFRESH BALANCE
  // =========================
  const refreshBalance = useCallback(async () => {
    if (publicKey) {
      await fetchBalance(publicKey)
    }
  }, [publicKey, fetchBalance])

  return (
    <WalletStateContext.Provider
      value={{
        publicKey,
        balance,
        connected,
        connecting,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletStateContext.Provider>
  )
}
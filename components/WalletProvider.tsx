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

  // Keep ref updated
  useEffect(() => {
    dappKeyPairRef.current = dappKeyPair
  }, [dappKeyPair])

  // =========================
  // 🔥 RESTORE SESSION FROM LOCALSTORAGE
  // =========================
  useEffect(() => {
    const saved = localStorage.getItem('wallet_pubkey')
    if (saved) {
      setPublicKey(saved)
      setConnected(true)
    }
  }, [])

  // =========================
  // 🔥 HANDLE PHANTOM REDIRECT (separate effect, runs after restore)
  // =========================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const phantomPubKey = params.get('phantom_encryption_public_key')
    const data = params.get('data')
    const nonce = params.get('nonce')

    // No redirect params = not a redirect, skip
    if (!phantomPubKey && !data && !nonce) return

    // Validate all required params exist
    if (!phantomPubKey || !data || !nonce) {
      console.error('Missing redirect params:', { phantomPubKey: !!phantomPubKey, data: !!data, nonce: !!nonce })
      return
    }

    console.log('Processing Phantom redirect...')

    try {
      // Decode the encryption public key from Phantom
      const phantomPubKeyBytes = bs58.decode(phantomPubKey)
      const nonceBytes = bs58.decode(nonce)
      const encryptedData = bs58.decode(data)

      console.log('Decoding sizes:', {
        phantomPubKeyBytes: phantomPubKeyBytes.length,
        nonceBytes: nonceBytes.length,
        encryptedData: encryptedData.length,
      })

      // nacl.box expects 32-byte public key, 24-byte nonce
      if (phantomPubKeyBytes.length !== 32) {
        console.error('Invalid phantom public key length:', phantomPubKeyBytes.length)
        return
      }

      if (nonceBytes.length !== 24) {
        console.error('Invalid nonce length:', nonceBytes.length)
        return
      }

      // Decrypt using nacl.box
      const decrypted = nacl.box.open(
        encryptedData,
        nonceBytes,
        phantomPubKeyBytes,
        dappKeyPairRef.current.secretKey
      )

      if (!decrypted) {
        console.error('Decryption failed - nacl.box.open returned null')
        console.error('This usually means: wrong key, wrong nonce, or corrupted data')
        return
      }

      const decoded = JSON.parse(Buffer.from(decrypted).toString())
      console.log('Decrypted payload:', decoded)

      const walletPubKey = decoded.public_key
      if (!walletPubKey) {
        console.error('No public_key in decrypted payload')
        return
      }

      // SUCCESS - update state
      setPublicKey(walletPubKey)
      setConnected(true)
      setConnecting(false)

      localStorage.setItem('wallet_pubkey', walletPubKey)

      // Fetch balance after state is updated
      fetchBalance(walletPubKey)

      // Clean URL only AFTER successful processing
      window.history.replaceState({}, document.title, window.location.pathname)

    } catch (err) {
      console.error('Decryption error:', err)
      setConnecting(false)
    }
  }, []) // Empty deps - run once on mount

  // =========================
  // 💰 FETCH BALANCE
  // =========================
  const fetchBalance = useCallback(async (pubKey: string) => {
    if (!pubKey) return
    try {
      console.log('Fetching balance for:', pubKey)
      const balanceLamports = await connection.getBalance(new PublicKey(pubKey))
      const solBalance = balanceLamports / 1e9
      console.log('Balance fetched:', solBalance, 'SOL')
      setBalance(solBalance)
    } catch (err) {
      console.error('Balance error:', err)
      setBalance(null)
    }
  }, [connection])

  // =========================
  // 🚀 CONNECT (REAL PHANTOM FLOW)
  // =========================
  const connect = () => {
    setConnecting(true)

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: 'devnet',
      app_url: window.location.origin,
      redirect_link: window.location.origin + window.location.pathname,
    })

    console.log('Connecting to Phantom with public key:', bs58.encode(dappKeyPair.publicKey))
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

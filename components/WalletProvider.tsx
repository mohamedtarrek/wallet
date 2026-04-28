import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'

interface PhantomWallet {
  publicKey: { toBase58(): string } | null
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toBase58(): string } }>
  disconnect: () => Promise<void>
  on: (event: string, callback: (args: any) => void) => void
  off: (event: string, callback: (args: any) => void) => void
}

interface WalletState {
  publicKey: string | null
  balance: number | null
  connected: boolean
  connecting: boolean
  disconnect: () => void
  connect: () => Promise<void>
  refreshBalance: () => Promise<void>
}

const WalletStateContext = createContext<WalletState>({
  publicKey: null,
  balance: null,
  connected: false,
  connecting: false,
  disconnect: () => {},
  connect: async () => {},
  refreshBalance: async () => {},
})

export const useWalletState = () => useContext(WalletStateContext)

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomWallet
    }
  }
}

const PHANTOM_DEEP_LINK = 'https://phantom.app/ul/v1/connect'
const PHANTOM_INSTALL_URL = 'https://phantom.app/download'

function getPhantomWallet(): PhantomWallet | null {
  if (typeof window !== 'undefined' && window.phantom?.solana) {
    return window.phantom.solana
  }
  return null
}

function buildPhantomUrl(appUrl: string): string {
  const params = new URLSearchParams({
    app_url: appUrl,
    redirect_link: appUrl,
  })
  return `${PHANTOM_DEEP_LINK}?${params.toString()}`
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [connection, setConnection] = useState<Connection | null>(null)

  useEffect(() => {
    const network = clusterApiUrl('devnet')
    setConnection(new Connection(network, 'confirmed'))

    const phantom = getPhantomWallet()
    if (phantom?.publicKey) {
      const pubKey = phantom.publicKey.toBase58()
      setPublicKey(pubKey)
      setConnected(true)
      fetchBalance(pubKey)
    }
  }, [])

  useEffect(() => {
    const phantom = getPhantomWallet()
    if (!phantom) return

    const handleConnect = (args: { publicKey: { toBase58(): string } }) => {
      const pubKey = args.publicKey.toBase58()
      setPublicKey(pubKey)
      setConnected(true)
      fetchBalance(pubKey)
    }

    const handleDisconnect = () => {
      setPublicKey(null)
      setConnected(false)
      setBalance(null)
    }

    phantom.on('connect', handleConnect)
    phantom.on('disconnect', handleDisconnect)

    return () => {
      phantom.off('connect', handleConnect)
      phantom.off('disconnect', handleDisconnect)
    }
  }, [])

  const fetchBalance = async (pubKey: string) => {
    if (!connection) return
    try {
      const publicKeyObj = new PublicKey(pubKey)
      const lamports = await connection.getBalance(publicKeyObj)
      setBalance(lamports / 1e9)
    } catch (err) {
      console.error('Failed to fetch balance:', err)
      setBalance(null)
    }
  }

  const connect = async () => {
    const phantom = getPhantomWallet()

    if (!phantom) {
      window.location.href = PHANTOM_INSTALL_URL
      return
    }

    try {
      setConnecting(true)
      const response = await phantom.connect({ onlyIfTrusted: true })
      const pubKey = response.publicKey.toBase58()
      setPublicKey(pubKey)
      setConnected(true)
      await fetchBalance(pubKey)
    } catch (err: any) {
      if (err.message?.includes('User rejected') || err.message?.includes('user rejected')) {
        try {
          const response = await phantom.connect()
          const pubKey = response.publicKey.toBase58()
          setPublicKey(pubKey)
          setConnected(true)
          await fetchBalance(pubKey)
        } catch (retryErr) {
          console.error('Connection failed:', retryErr)
        }
      } else {
        console.error('Connection error:', err)
      }
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = async () => {
    const phantom = getPhantomWallet()
    if (phantom) {
      await phantom.disconnect()
    }
    setPublicKey(null)
    setConnected(false)
    setBalance(null)
  }

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
        connecting,
        disconnect,
        connect,
        refreshBalance,
      }}
    >
      {children}
    </WalletStateContext.Provider>
  )
}

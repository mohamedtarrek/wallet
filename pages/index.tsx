import { useState, useEffect, useCallback } from 'react'
import { useWalletState } from '../components/WalletProvider'

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword))
  const isMobileScreen = window.innerWidth < 768
  return isMobileUA || (isMobileScreen && ('ontouchstart' in window || navigator.maxTouchPoints > 0))
}

export default function Home() {
  const { publicKey, balance, connected, connecting, disconnect, connect, refreshBalance } = useWalletState()
  const [isMobile, setIsMobile] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletDetected, setWalletDetected] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(false)

  // Track when balance is being fetched
  useEffect(() => {
    if (connected && publicKey && balance === null && !balanceLoading) {
      setBalanceLoading(true)
    }
    if (balance !== null) {
      setBalanceLoading(false)
    }
  }, [connected, publicKey, balance, balanceLoading])

  useEffect(() => {
    setIsMobile(isMobileDevice())
    checkWallet()
  }, [])

  const checkWallet = useCallback(() => {
    const hasPhantom = typeof window !== 'undefined' && !!(window as any).phantom?.solana
    setWalletDetected(hasPhantom)
  }, [])

  const handleConnect = async () => {
    setError(null)
    try {
      await connect()
    } catch (err: any) {
      if (err.message?.includes('User rejected') || err.message?.includes('user rejected')) {
        setError('Connection rejected. Please approve the request in Phantom wallet.')
      } else if (!walletDetected) {
        setError('Phantom wallet not detected. Please install it from the app store.')
        setTimeout(() => {
          window.location.href = 'https://phantom.app/download'
        }, 2000)
      } else {
        setError('Failed to connect. Please try again.')
      }
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setError(null)
  }

  const copyAddress = async () => {
    if (!publicKey) return
    try {
      await navigator.clipboard.writeText(publicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  useEffect(() => {
    const handleDisconnectEvent = () => {
      setError('Wallet disconnected unexpectedly.')
    }
    window.addEventListener('phantom_disconnect', handleDisconnectEvent)
    return () => window.removeEventListener('phantom_disconnect', handleDisconnectEvent)
  }, [])

  if (!isMobile) {
    return (
      <div style={styles.container}>
        <div style={styles.desktopMessage}>
          <div style={styles.phantomIcon}>👻</div>
          <h1 style={styles.desktopTitle}>Mobile Only</h1>
          <p style={styles.desktopText}>
            This app is designed for mobile devices only.<br />
            Please open it on your smartphone or tablet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.phantomIcon}>👻</span>
          <h1 style={styles.title}>Phantom Wallet</h1>
        </div>
        <div style={styles.networkBadge}>
          <span style={styles.networkDot}></span>
          Devnet
        </div>
      </header>

      <main style={styles.main}>
        {!connected && !connecting && (
          <div style={styles.connectCard}>
            <div style={styles.cardIcon}>👻</div>
            <h2 style={styles.cardTitle}>Connect Your Wallet</h2>
            <p style={styles.cardSubtitle}>
              Connect to Solana Devnet to view your wallet balance
            </p>

            {!walletDetected && (
              <div style={styles.warningBanner}>
                <span style={styles.warningIcon}>⚠️</span>
                Phantom wallet not detected. It will redirect you to install.
              </div>
            )}

            {error && (
              <div style={styles.errorBanner}>
                <span>{error}</span>
                <button
                  style={styles.dismissBtn}
                  onClick={() => setError(null)}
                >
                  ✕
                </button>
              </div>
            )}

            <button
              style={styles.connectButton}
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <span style={styles.spinner}></span>
                  Connecting...
                </>
              ) : (
                <>
                  <span>👻</span>
                  Connect Wallet
                </>
              )}
            </button>

            <p style={styles.secureNote}>
              🔒 Read-only access • Devnet only
            </p>
          </div>
        )}

        {connecting && (
          <div style={styles.connectCard}>
            <div style={styles.loadingContainer}>
              <div style={styles.largeSpinner}></div>
              <h2 style={styles.cardTitle}>Connecting...</h2>
              <p style={styles.cardSubtitle}>
                Please approve the connection in your Phantom wallet
              </p>
            </div>
          </div>
        )}

        {connected && publicKey && (
          <div style={styles.walletCard}>
            <div style={styles.statusRow}>
              <div style={styles.statusBadge}>
                <span style={styles.statusDot}></span>
                Connected
              </div>
              <button style={styles.refreshBtn} onClick={refreshBalance}>
                ↻
              </button>
            </div>

            <div style={styles.addressSection}>
              <p style={styles.addressLabel}>Wallet Address</p>
              <div style={styles.addressRow}>
                <span style={styles.addressText} className="mono">
                  {truncateAddress(publicKey)}
                </span>
                <button style={styles.copyBtn} onClick={copyAddress}>
                  {copied ? '✓' : '📋'}
                </button>
              </div>
              {copied && <p style={styles.copiedText}>Copied!</p>}
            </div>

            <div style={styles.balanceSection}>
              <p style={styles.balanceLabel}>Balance</p>
              <div style={styles.balanceRow}>
                <span style={styles.balanceAmount}>
                  {balance !== null ? balance.toFixed(4) : '—'}
                </span>
                <span style={styles.balanceUnit}>SOL</span>
              </div>
              {balance === null && (
                <p style={styles.loadingBalance}>Fetching balance...</p>
              )}
            </div>

            <div style={styles.networkInfo}>
              <span>Network: </span>
              <span style={styles.networkName}>Solana Devnet</span>
            </div>

            {error && (
              <div style={styles.errorBanner}>
                <span>{error}</span>
                <button style={styles.dismissBtn} onClick={() => setError(null)}>
                  ✕
                </button>
              </div>
            )}

            <button style={styles.disconnectButton} onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>Solana Devnet • Read-only</p>
      </footer>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0D1117 0%, #161B22 100%)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    maxWidth: '480px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    paddingTop: '16px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  phantomIcon: {
    fontSize: '28px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#F0F6FC',
  },
  networkBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#1C2128',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#8B949E',
    border: '1px solid #30363D',
  },
  networkDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#10B981',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  connectCard: {
    background: '#161B22',
    borderRadius: '16px',
    padding: '32px 24px',
    textAlign: 'center' as const,
    border: '1px solid #30363D',
  },
  cardIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#F0F6FC',
    marginBottom: '8px',
  },
  cardSubtitle: {
    fontSize: '14px',
    color: '#8B949E',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  warningBanner: {
    background: 'rgba(251, 191, 36, 0.1)',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    fontSize: '13px',
    color: '#FBBF24',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
  },
  warningIcon: {
    fontSize: '16px',
  },
  errorBanner: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    fontSize: '13px',
    color: '#EF4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dismissBtn: {
    background: 'transparent',
    color: '#EF4444',
    fontSize: '14px',
    padding: '4px 8px',
  },
  connectButton: {
    width: '100%',
    height: '56px',
    background: 'linear-gradient(135deg, #AB9FF5 0%, #8B5CF6 100%)',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'opacity 0.2s, transform 0.1s',
    border: 'none',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#FFFFFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  secureNote: {
    marginTop: '16px',
    fontSize: '12px',
    color: '#8B949E',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  largeSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(171, 159, 245, 0.2)',
    borderTopColor: '#AB9FF5',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  walletCard: {
    background: '#161B22',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #30363D',
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(16, 185, 129, 0.1)',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#10B981',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10B981',
  },
  refreshBtn: {
    background: '#1C2128',
    border: '1px solid #30363D',
    borderRadius: '8px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#8B949E',
  },
  addressSection: {
    marginBottom: '24px',
  },
  addressLabel: {
    fontSize: '12px',
    color: '#8B949E',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  addressRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#0D1117',
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid #30363D',
  },
  addressText: {
    fontSize: '14px',
    color: '#F0F6FC',
    letterSpacing: '0.5px',
  },
  copyBtn: {
    background: 'transparent',
    fontSize: '16px',
    padding: '4px 8px',
  },
  copiedText: {
    fontSize: '12px',
    color: '#10B981',
    marginTop: '8px',
  },
  balanceSection: {
    marginBottom: '24px',
  },
  balanceLabel: {
    fontSize: '12px',
    color: '#8B949E',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  balanceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  balanceAmount: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#F0F6FC',
  },
  balanceUnit: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#AB9FF5',
  },
  loadingBalance: {
    fontSize: '12px',
    color: '#8B949E',
    marginTop: '8px',
  },
  networkInfo: {
    fontSize: '13px',
    color: '#8B949E',
    marginBottom: '24px',
    padding: '12px',
    background: '#0D1117',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  networkName: {
    color: '#10B981',
    fontWeight: '500',
  },
  disconnectButton: {
    width: '100%',
    height: '48px',
    background: 'transparent',
    border: '1px solid #30363D',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#8B949E',
    transition: 'background 0.2s, color 0.2s',
  },
  desktopMessage: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '40px 20px',
  },
  desktopTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#F0F6FC',
    marginTop: '16px',
    marginBottom: '12px',
  },
  desktopText: {
    fontSize: '16px',
    color: '#8B949E',
    lineHeight: '1.6',
  },
  footer: {
    textAlign: 'center',
    padding: '20px 0',
    fontSize: '12px',
    color: '#8B949E',
  },
}

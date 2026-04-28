# Phantom Wallet Mobile dApp - Specification

## 1. Project Overview

**Project Name:** phantom-mobile-wallet
**Type:** Mobile-first decentralized application (dApp)
**Core Functionality:** Connect to Phantom Wallet on Solana Devnet, display wallet address and SOL balance
**Target Users:** Mobile (iOS & Android) users with Phantom Wallet

---

## 2. Visual & Rendering Specification

### Scene Setup
- Single-page application with 3 states: Initial, Loading, Connected
- No 3D rendering - pure React UI
- Mobile-optimized viewport with touch-friendly interactions

### Color Palette
- **Background:** `#0D0D0D` (near black)
- **Primary:** `#5C4EE5` (Phantom purple)
- **Secondary:** `#2D2D2D` (card background)
- **Accent:** `#00FF9D` (success/connected)
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `#8E8E93`
- **Error:** `#FF4757`

### Typography
- **Font:** "Inter" (Google Fonts) - fallback to system sans-serif
- **Headings:** 600 weight, tracking tight
- **Body:** 400 weight
- **Monospace (address):** "JetBrains Mono" for wallet address

### UI Components
1. **Header** - App title with Phantom logo icon
2. **Connection Card** - Main card containing wallet info
3. **Connect Button** - Large touch-friendly button (min 48px height)
4. **Status Badge** - Shows Connected/Disconnected state
5. **Address Display** - Copyable wallet address with copy icon
6. **Balance Display** - Large SOL balance with conversion
7. **Loading Spinner** - Animated during connection
8. **Error Toast** - Red notification for errors

---

## 3. Technical Specification

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **React:** 18.x
- **Solana Web3.js:** @solana/web3.js
- **Wallet Adapter:** @solana/wallet-adapter-react, @solana/wallet-adapter-react-ui
- **Wallets:** @solana/wallet-adapter-wallets (Phantom support)
- **Cluster:** Devnet only via clusterApiUrl("devnet")

### Mobile Detection
- Use `navigator.userAgent` and screen width check
- Display mobile-only message if on desktop
- Responsive breakpoints: < 768px (mobile)

### Wallet Connection Flow
1. Detect Phantom Wallet via `window.phantom?.solana`
2. Use `connect()` with `onlyIfTrusted: true` for silent reconnect
3. Fallback to deep link if Phantom not detected
4. Handle OAuth redirect back to app

### Phantom Deep Link
- iOS: `phantom://`
- Android: `https://phantom.app/ul/v1/connect?...`
- Fallback: `https://phantom.app/download` if not installed

### Data Fetching
- Balance via `connection.getBalance(publicKey)`
- Convert lamports to SOL: `balance / 1e9`
- Auto-refresh balance every 30 seconds when connected

### State Management
- React useState/useEffect for local state
- Wallet adapter context for connection state
- No external state library needed

---

## 4. Application States

### State 1: Initial (Not Connected)
- Display app header with Phantom branding
- Large "Connect Wallet" button
- Subtle tagline: "Connect to Solana Devnet"

### State 2: Loading (Connecting)
- Button shows spinner
- "Connecting..." text
- Disable further interactions

### State 3: Connected
- Green status badge "Connected"
- Copyable public address (truncated with full on tap)
- SOL balance prominently displayed
- "Disconnect" button
- Network indicator "Devnet"

### State 4: Error
- Red error toast/message
- Error description
- "Try Again" button

### State 5: Desktop Blocked
- Full-screen message
- "This app is for mobile devices only"
- QR code or link to open on mobile

---

## 5. Error Handling

| Error | Handling |
|-------|----------|
| User rejects connection | Show "Connection rejected" message, allow retry |
| Phantom not installed | Redirect to Phantom download page |
| Network/RPC failure | Show "Network error", retry connection |
| Wallet disconnected | Auto-detect, show disconnected state |
| Invalid network | Force reconnect to Devnet only |

---

## 6. Security Considerations

- Devnet only - no Mainnet transactions
- No private key access - read-only operations
- Validate all RPC responses
- Sanitize displayed addresses (no truncation vulnerability)
- CSP headers configured

---

## 7. Acceptance Criteria

1. ✅ App loads on mobile browsers (iOS Safari, Android Chrome)
2. ✅ "Connect Wallet" button initiates Phantom connection
3. ✅ If Phantom not installed, user redirected to download
4. ✅ After connection, wallet address displayed correctly
5. ✅ Balance fetched and displayed in SOL (not lamports)
6. ✅ Devnet only - no Testnet/Mainnet option shown
7. ✅ Disconnect functionality works
8. ✅ All error states handled gracefully
9. ✅ Mobile UI is touch-friendly and responsive
10. ✅ Loading states shown during async operations

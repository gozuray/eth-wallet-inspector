// Import React (application core)
import React from 'react'

// Import ReactDOM to render the app in the browser
import ReactDOM from 'react-dom/client'

// Import main App component
import App from './App.jsx'

// Import global styles
import './index.css'

// RainbowKit styles (wallet UI)
import '@rainbow-me/rainbowkit/styles.css'

// wagmi provider (blockchain connection manager)
import { WagmiConfig } from 'wagmi'

// RainbowKit provides the "Connect Wallet" button and wallet UI
// getDefaultConfig builds the base Web3 configuration
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'

// React Query is used by wagmi to cache data (balances, requests, etc.)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// viem is the low-level engine to connect to Ethereum nodes
// fallback allows using multiple RPCs if one fails
import { fallback, http } from 'viem'

// Supported networks (Ethereum mainnet and testnet)
import { mainnet, sepolia } from 'wagmi/chains'



// =======================
// 1️⃣ SELECT NETWORK FROM .env
// =======================

// Read active network from .env
// Example: VITE_CHAIN=sepolia  or  VITE_CHAIN=mainnet
const CHAIN = import.meta.env.VITE_CHAIN || 'mainnet'



// =======================
// 2️⃣ SUPPORTED NETWORKS
// =======================

// Store supported chains in an object
const CHAINS = {
  mainnet,
  sepolia,
}



// =======================
// 3️⃣ RPCs PER NETWORK
// =======================

// RPC = blockchain node endpoint
// fallback automatically tries the next RPC if one fails
const RPCS = {
  mainnet: [
    "https://rpc.flashbots.net",
    "https://eth.llamarpc.com",
  ],
  sepolia: [
    "https://rpc.sepolia.org",
    "https://ethereum-sepolia.publicnode.com",
  ],
}



// =======================
// 4️⃣ SELECT ACTIVE NETWORK
// =======================

// Pick the network based on .env
// Fallback to mainnet if value is invalid
const chain = CHAINS[CHAIN] || mainnet



// =======================
// 5️⃣ REACT QUERY CLIENT
// =======================

// React Query handles cache and Web3 request state
const queryClient = new QueryClient()



// =======================
// 6️⃣ FINAL WEB3 CONFIG
// =======================

// This block prepares the blockchain connection
const config = getDefaultConfig({

  // App name shown in the wallet
  appName: 'ETH Wallet Inspector',

  // WalletConnect Project ID (stored in .env)
  projectId: import.meta.env.VITE_WC_PROJECT_ID,

  // Active blockchain network
  chains: [chain],

  // RPC configuration depending on network
  transports: {
    // chain.id is the numeric identifier of the network
    [chain.id]: fallback(
      // Use multiple RPC endpoints for reliability
      (RPCS[CHAIN] || RPCS.mainnet).map(url => http(url))
    ),
  },

  // This project does not use server-side rendering
  ssr: false,
})



// =======================
// 7️⃣ APP RENDERING
// =======================

// Tell React where to mount the application
ReactDOM.createRoot(document.getElementById('root')).render(

  // StrictMode helps detect common development issues
  <React.StrictMode>

    {/* Global React Query provider */}
    <QueryClientProvider client={queryClient}>

      {/* Blockchain provider */}
      <WagmiConfig config={config}>

        {/* Wallet UI provider */}
        <RainbowKitProvider>

          {/* Application entry point */}
          <App />

        </RainbowKitProvider>
      </WagmiConfig>

    </QueryClientProvider>
  </React.StrictMode>
)

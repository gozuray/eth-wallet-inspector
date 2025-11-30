import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import React from "react";
import "./App.css";

function App() {
  const { address, isConnected, chain } = useAccount();

  const { data: balance } = useBalance({
    address,
    chainId: chain?.id,
    query: {
      enabled: !!address,
      watch: true,
    },
  });

  const [priceUsd, setPriceUsd] = React.useState(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setPriceUsd(3035.2); // dummy price
  }, []);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <div className="app">
      <div className="card">

        <h1 className="title">ETH WALLET INSPECTOR</h1>
        <p className="subtitle">Ethereum Account Overview</p>

        <div className="badge">TESTNET MODE · SEPOLIA</div>

        {/* WALLET */}
        <div className="wallet-row">
          <ConnectButton showBalance={false} />
        </div>

        {/* BALANCE */}
        {isConnected && (
          <div className="balance">
            <div className="balance-content">
              <span>Balance</span>
              <strong>
                {balance?.formatted || "0.00"} {balance?.symbol}
              </strong>

              {balance && priceUsd && (
                <div style={{ fontSize: "0.85rem", marginTop: 6 }}>
                  ≈ $
                  {(parseFloat(balance.formatted) * priceUsd).toLocaleString(
                    undefined,
                    { maximumFractionDigits: 2 }
                  )}{" "}
                  USD
                </div>
              )}
            </div>

            {/* COPY CHIP */}
            {address && (
              <button
                className={`copy-chip ${copied ? "copied" : ""}`}
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                <span className="copy-icon">📋</span>
                <span className="copy-text">
                  {copied ? "Copied!" : shortAddress}
                </span>
              </button>
            )}
          </div>
        )}

        <footer className="foot">Web3 Dashboard · Powered by Ethereum</footer>

      </div>
    </div>
  );
}

export default App;

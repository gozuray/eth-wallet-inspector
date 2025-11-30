import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import React from 'react'


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

  const [priceUsd, setPriceUsd] = React.useState(null)

React.useEffect(() => {
  fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
    .then(res => res.json())
    .then(data => setPriceUsd(data.ethereum.usd))
}, [])


  return (
    <div className="app">
      <div className="card">
        <div className="title">ETH WALLET INSPECTOR</div>
        <div className="subtitle">Ethereum Account Overview</div>

        <ConnectButton />

        {isConnected && (
          <>
           <div className="balance">
  <span>Balance</span>
  <strong>
    {balance?.formatted || '0.00'} {balance?.symbol}
  </strong>

  {balance && priceUsd && (
    <div style={{ fontSize: "0.85rem", marginTop: 6 }}>
      ≈ $
      {(parseFloat(balance.formatted) * priceUsd).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}{" "}
      USD
    </div>
  )}
</div>


            <div className="info">
              <div>
                <strong>NETWORK:</strong> {chain?.name || "Unknown"}
              </div>

              <div
  style={{
    marginTop: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
  <div>
    <strong>ADDRESS:</strong>{" "}
    {address.slice(0, 6)}...{address.slice(-4)}
  </div>

  <button
    style={{
      padding: "4px 10px",
      fontSize: "0.7rem",
      cursor: "pointer",
      borderRadius: "6px"
    }}
    onClick={() => navigator.clipboard.writeText(address)}
  >
    Copy
  </button>
</div>

            </div>
          </>
        )}

        <div className="foot">Web3 Dashboard · Powered by Ethereum</div>
      </div>
    </div>
  );
}

export default App;

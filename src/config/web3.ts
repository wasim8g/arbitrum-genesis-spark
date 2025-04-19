
import { configureChains, createClient } from "wagmi";
import { arbitrum } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrum],
  [
    // Fallback to public RPC for Arbitrum
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.id === arbitrum.id 
          ? 'https://arb1.arbitrum.io/rpc' 
          : '',
        webSocket: chain.id === arbitrum.id 
          ? 'wss://arb1.arbitrum.io/ws' 
          : '',
      }),
    }),
  ]
);

// Set up wagmi config
export const config = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains })
  ],
  publicClient,
  webSocketPublicClient,
});


import { WagmiConfig } from "wagmi";
import { config } from "../config/web3";
import WalletConnect from "@/components/WalletConnect";

const Index = () => {
  return (
    <WagmiConfig config={config}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Arbitrum dApp</h1>
          <WalletConnect />
        </div>
      </div>
    </WagmiConfig>
  );
};

export default Index;

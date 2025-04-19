
import { WagmiConfig } from "wagmi";
import { config } from "../config/web3";
import WalletConnect from "@/components/WalletConnect";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <WagmiConfig config={config}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/80">
          <CardHeader>
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Arbitrum dApp
            </h1>
          </CardHeader>
          <CardContent>
            <WalletConnect />
          </CardContent>
        </Card>
      </div>
    </WagmiConfig>
  );
};

export default Index;

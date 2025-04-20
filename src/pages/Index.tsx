
import { WagmiConfig } from "wagmi";
import { config } from "../config/web3";
import WalletConnect from "@/components/WalletConnect";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleGoToSocial = () => {
    navigate('/social');
  };

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
          <CardFooter className="flex justify-center pt-0">
            <Button 
              variant="outline" 
              className="mt-4 border-violet-500 text-violet-700 hover:bg-violet-50"
              onClick={handleGoToSocial}
            >
              Try ArbiGram - Social App
            </Button>
          </CardFooter>
        </Card>
      </div>
    </WagmiConfig>
  );
};

export default Index;

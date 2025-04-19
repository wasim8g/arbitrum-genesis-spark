
import { WagmiConfig } from "wagmi";
import { config } from "../config/web3";
import { useState } from "react";
import SocialFeed from "@/components/social/SocialFeed";
import CreatePost from "@/components/social/CreatePost";
import SocialHeader from "@/components/social/SocialHeader";
import WalletConnect from "@/components/WalletConnect";
import { Card } from "@/components/ui/card";

const Social = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Function to handle successful authentication
  const handleAuthenticated = (status: boolean) => {
    setIsAuthenticated(status);
  };

  return (
    <WagmiConfig config={config}>
      <div className="min-h-screen bg-gradient-to-br from-violet-500/10 to-purple-500/10">
        <SocialHeader />
        
        <div className="container mx-auto px-4 py-6">
          {!isAuthenticated ? (
            <Card className="max-w-md mx-auto p-6 backdrop-blur-sm bg-white/80">
              <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Connect Your Wallet to Join
              </h2>
              <WalletConnect onAuthenticated={handleAuthenticated} />
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SocialFeed />
              </div>
              <div className="lg:col-span-1">
                <CreatePost />
              </div>
            </div>
          )}
        </div>
      </div>
    </WagmiConfig>
  );
};

export default Social;

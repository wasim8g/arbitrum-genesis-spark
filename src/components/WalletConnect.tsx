
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Wallet, LogOut, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

interface WalletConnectProps {
  onAuthenticated?: (status: boolean) => void;
}

const WalletConnect = ({ onAuthenticated }: WalletConnectProps) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address: address,
  });

  // Notify parent component about authentication status
  useEffect(() => {
    if (onAuthenticated) {
      onAuthenticated(isConnected);
    }
  }, [isConnected, onAuthenticated]);

  // Handle connection errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleConnect = async () => {
    try {
      // Check if there are available connectors
      if (connectors && connectors.length > 0) {
        const connector = connectors[0];
        console.log("Connecting with connector:", connector.name);
        await connect({ connector });
      } else {
        console.error("No connectors available");
        toast({
          title: "Connection Error",
          description: "No wallet connectors available",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Connection error:", err);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
      toast({
        title: "Disconnected",
        description: "Wallet disconnected successfully",
      });
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  if (isConnected) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Connected Address</div>
          <div className="p-3 bg-gray-50 rounded-lg break-all font-mono text-sm">
            {address}
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Balance</div>
          <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
            {balance?.formatted} {balance?.symbol}
          </div>
        </div>
        <Button onClick={handleDisconnect} variant="destructive" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect Wallet
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="mr-2 h-4 w-4" />
      )}
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;

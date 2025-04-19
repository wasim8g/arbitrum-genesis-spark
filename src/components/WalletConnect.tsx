
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

  const handleConnect = async () => {
    try {
      await connect({ connector: connectors[0] });
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
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
        <Button onClick={() => disconnect()} variant="destructive" className="w-full">
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

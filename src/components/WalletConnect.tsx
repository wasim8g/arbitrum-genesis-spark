
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Wallet, LogOut } from "lucide-react";

const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address: address,
  });

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
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="text-sm text-gray-600">Connected to {address}</div>
        <div className="text-sm text-gray-600">
          Balance: {balance?.formatted} {balance?.symbol}
        </div>
        <Button onClick={() => disconnect()} variant="outline">
          <LogOut className="mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading}>
      <Wallet className="mr-2" />
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;

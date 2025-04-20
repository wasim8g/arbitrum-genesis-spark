import { useState } from "react";
import { Home, Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

const SocialHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  
  const getInitials = (address: string | undefined) => {
    if (!address) return "AR";
    return `${address.substring(0, 2)}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        description: `Searching for "${searchQuery}"`,
      });
    }
  };

  const handleHomeClick = () => {
    toast({
      description: "Home feed refreshed",
    });
  };

  const handleNotificationsClick = () => {
    toast({
      description: "Notifications panel would open here",
    });
  };

  const handleProfileClick = () => {
    if (isConnected) {
      navigate('/profile');
    } else {
      toast({
        title: "Not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-sm bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              ArbiGram
            </Link>
          </div>
          
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 w-full bg-gray-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={handleHomeClick}>
              <Home className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => handleSearch}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNotificationsClick}>
              <Bell className="h-5 w-5" />
            </Button>
            
            {isConnected ? (
              <Button variant="ghost" size="icon" onClick={handleProfileClick}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-violet-200 text-violet-800">
                    {getInitials(address)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={handleProfileClick}>
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SocialHeader;

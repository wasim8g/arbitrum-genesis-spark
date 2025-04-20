
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/user";
import { createClient } from '@supabase/supabase-js';
import { useAccount } from 'wagmi';
import { toast } from "@/components/ui/use-toast";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!, 
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!address) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', address)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Could not fetch profile",
          variant: "destructive"
        });
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [address]);

  const handleUpdateProfile = () => {
    // TODO: Implement profile update modal
    toast({
      description: "Profile update functionality coming soon"
    });
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="space-y-4">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage 
                  src={profile.avatar_url || "/placeholder.svg"} 
                  alt={profile.username} 
                />
                <AvatarFallback>
                  {profile.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">{profile.username}</h2>
                <p className="text-muted-foreground">{profile.wallet_address}</p>
                <p className="mt-2">{profile.bio || "No bio available"}</p>
              </div>
              <div className="flex justify-center">
                <Button onClick={handleUpdateProfile}>
                  Update Profile
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">Loading profile...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

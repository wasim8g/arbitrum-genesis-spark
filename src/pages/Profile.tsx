
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/user";
import { createClient } from '@supabase/supabase-js';
import { useAccount } from 'wagmi';
import { toast } from "sonner";
import UpdateProfileDialog from '@/components/profile/UpdateProfileDialog';
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!, 
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { address } = useAccount();

  const fetchProfile = async () => {
    if (!address) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', address)
      .single();

    if (error) {
      toast.error("Could not fetch profile");
    } else {
      setProfile(data);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [address]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${profile.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      toast.success("Avatar updated successfully");
      fetchProfile();
    } catch (error) {
      toast.error("Failed to update avatar");
      console.error(error);
    }
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
              <div className="relative w-24 h-24 mx-auto">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={profile.avatar_url || "/placeholder.svg"} 
                    alt={profile.username} 
                  />
                  <AvatarFallback>
                    {profile.username?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <Input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">{profile.username}</h2>
                <p className="text-muted-foreground">{profile.wallet_address}</p>
                <p className="mt-2">{profile.bio || "No bio available"}</p>
              </div>
              <div className="flex justify-center">
                <UpdateProfileDialog profile={profile} onProfileUpdate={fetchProfile} />
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

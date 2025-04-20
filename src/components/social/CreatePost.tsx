
import { useState, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Image, Send } from "lucide-react";
import { useAccount } from "wagmi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { usePostsStore } from "@/store/posts";

const CreatePost = () => {
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { address } = useAccount();
  const addPost = usePostsStore((state) => state.addPost);

  const getInitials = (address: string | undefined) => {
    if (!address) return "AR";
    return `${address.substring(0, 2)}`;
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImageUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setIsImageUploading(false);
        toast({
          description: "Image uploaded successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (!postContent.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Add the post to our store
    addPost({
      author: address || "Anonymous",
      authorShort: address ? address.substring(0, 6) : "Anon",
      content: postContent,
      image: selectedImage || undefined,
    });

    // Reset form
    setPostContent("");
    setSelectedImage(null);
    setIsSubmitting(false);
    
    toast({
      title: "Success",
      description: "Your post has been submitted to Arbitrum!",
    });
  };

  const handleCameraAccess = () => {
    setIsCameraActive(true);
    toast({
      description: "Camera access feature would be implemented here",
    });
    setIsCameraActive(false);
  };

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-violet-200 text-violet-800">
              {getInitials(address)}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">Create Post</div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Textarea
          placeholder="What's happening on Arbitrum today?"
          className="min-h-24 resize-none"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        
        {selectedImage && (
          <div className="relative">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setSelectedImage(null)}
            >
              Remove
            </Button>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleImageUpload}
            disabled={isImageUploading}
          >
            {isImageUploading ? (
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-violet-600 animate-spin" />
            ) : (
              <Image className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleCameraAccess}
            disabled={isCameraActive}
          >
            {isCameraActive ? (
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-violet-600 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <Button 
          onClick={handleSubmitPost} 
          disabled={!postContent.trim() || isSubmitting}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <span className="mr-2">Posting</span>
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin" />
            </div>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Post
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePost;

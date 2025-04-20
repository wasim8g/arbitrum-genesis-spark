
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

// Mock data for posts
const mockPosts = [
  {
    id: 1,
    author: "0x123...abc",
    authorShort: "0x123",
    content: "Just minted my first NFT on Arbitrum! #ArbitrumNFT",
    likes: 24,
    comments: 5,
    timeAgo: "2 hours ago",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
  },
  {
    id: 2,
    author: "0xabc...789",
    authorShort: "0xabc",
    content: "Love building on Arbitrum! The speed and low fees are amazing for social dApps. Who else is working on cool projects here?",
    likes: 42,
    comments: 7,
    timeAgo: "3 hours ago"
  },
  {
    id: 3,
    author: "0x456...def",
    authorShort: "0x456",
    content: "Check out this amazing view from my weekend trip! #ArbitrumCommunity",
    likes: 102,
    comments: 12,
    timeAgo: "5 hours ago",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  }
];

interface Post {
  id: number;
  author: string;
  authorShort: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  image?: string;
}

const PostCard = ({ post }: { post: Post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentOpen, setCommentOpen] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
      toast({
        description: "Removed like from post",
      });
    } else {
      setLikeCount(likeCount + 1);
      toast({
        description: "Liked post",
      });
    }
    setLiked(!liked);
  };

  const handleComment = () => {
    setCommentOpen(!commentOpen);
    if (!commentOpen) {
      toast({
        description: "Comment section opened",
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "Shared!",
      description: "Post has been shared",
    });
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-violet-200 text-violet-800">
              {post.authorShort.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{post.authorShort}</div>
            <div className="text-xs text-gray-500">{post.timeAgo}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <div className="rounded-md overflow-hidden -mx-6">
            <img 
              src={post.image} 
              alt="Post content" 
              className="w-full object-cover h-64 md:h-80"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={liked ? "text-red-500" : ""}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
            {likeCount}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleComment}>
            <MessageSquare className="h-4 w-4 mr-1" />
            {post.comments}
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const SocialFeed = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Latest Posts</h2>
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default SocialFeed;


import { create } from 'zustand';
import { Post } from '@/types/post';

interface PostsState {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timeAgo'>) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [
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
      content: "Love building on Arbitrum! The speed and low fees are amazing for social dApps.",
      likes: 42,
      comments: 7,
      timeAgo: "3 hours ago"
    },
  ],
  addPost: (newPost) => 
    set((state) => ({
      posts: [{
        ...newPost,
        id: state.posts.length + 1,
        likes: 0,
        comments: 0,
        timeAgo: "Just now"
      }, ...state.posts]
    })),
}));

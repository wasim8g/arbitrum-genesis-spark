
export interface Post {
  id: number;
  author: string;
  authorShort: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  image?: string;
}

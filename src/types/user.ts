
export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  wallet_address: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  timestamp: Date;
  read_status: boolean;
}

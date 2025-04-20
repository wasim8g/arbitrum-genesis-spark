
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChatMessage, UserProfile } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { toast } from "sonner";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface ChatWindowProps {
  currentUser: UserProfile;
  recipientId: string;
}

const ChatWindow = ({ currentUser, recipientId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipient, setRecipient] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchRecipient = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', recipientId)
        .single();

      if (error) {
        toast.error("Could not fetch recipient profile");
      } else {
        setRecipient(data);
      }
    };

    fetchRecipient();
  }, [recipientId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
        .order('timestamp', { ascending: true });

      if (error) {
        toast.error("Could not fetch messages");
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on('INSERT', (payload) => {
        setMessages(prev => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser.id]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUser.id,
          recipient_id: recipientId,
          content: newMessage,
          timestamp: new Date().toISOString(),
          read_status: false,
        });

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {recipient && (
            <>
              <Avatar className="h-8 w-8">
                <AvatarImage src={recipient.avatar_url} />
                <AvatarFallback>
                  {recipient.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{recipient.username}</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUser.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] ${
                message.sender_id === currentUser.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </CardContent>
      <div className="p-4 border-t">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatWindow;

'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useChat } from '../hooks/use-chat';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';

type ChatPageProps = {
  channelId: string;
};

export function ChatPage({ channelId }: ChatPageProps) {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage, isSending, messagesEndRef } = useChat(channelId);

  const handleSendMessage = async (content: string) => {
    if (!user?.id) return;
    await sendMessage(content, user.id);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatMessages messages={messages} messagesEndRef={messagesEndRef} className="flex-1" />
      <ChatInput onSend={handleSendMessage} isSending={isSending} />
    </div>
  );
}

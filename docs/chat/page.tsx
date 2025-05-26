import { ChatPage } from '@/features/chat/components/chat-page';

export default function ChatRoute() {
  // For now, we'll use a hardcoded channel ID
  // In a real app, this would come from the URL params or some other source
  const channelId = 'main';

  return <ChatPage channelId={channelId} />;
}

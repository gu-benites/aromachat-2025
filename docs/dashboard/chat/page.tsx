import { DashboardLayout } from '@/features/dashboard/components/dashboard-layout';
import { ChatPage } from '@/features/chat/components';

export default function DashboardChatPage() {
  return (
    <DashboardLayout>
      <ChatPage />
    </DashboardLayout>
  );
}

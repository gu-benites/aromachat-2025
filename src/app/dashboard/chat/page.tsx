import { DashboardLayout } from '@/features/dashboard/components/dashboard-layout';
import { ChatPage } from '@/features/dashboard/components/chat';

export default function DashboardChatPage() {
  return (
    <DashboardLayout>
      <ChatPage />
    </DashboardLayout>
  );
}

"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { VercelV0Chat } from "@/components/chat-homescreen";

export default function ChatPage() {
  return (
    <DashboardLayout>
      <VercelV0Chat />
    </DashboardLayout>
  );
}
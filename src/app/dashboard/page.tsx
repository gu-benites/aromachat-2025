import { DashboardLayout } from '@/features/dashboard/components/dashboard-layout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Add your dashboard widgets here */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-medium">Welcome back!</h3>
            <p className="text-sm text-muted-foreground">
              Your dashboard is ready.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

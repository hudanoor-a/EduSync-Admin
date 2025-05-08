
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-secondary/30 dark:bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

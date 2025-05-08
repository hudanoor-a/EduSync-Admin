import { AdminSidebar } from '@/components/admin/AdminSidebar.jsx'; // .jsx extension
import { AdminHeader } from '@/components/admin/AdminHeader.jsx'; // .jsx extension
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'; // Keep .jsx implicit if module resolution works

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider> {/* Wrap with provider */}
      <AdminSidebar /> {/* Render the sidebar */}
      <SidebarInset className="flex flex-col h-screen"> {/* Main content area wrapper */}
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-secondary/30 dark:bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
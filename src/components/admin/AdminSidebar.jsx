
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Users,
  CalendarDays,
  FileText,
  MessageSquare,
  BarChart3,
  UserCircle,
  BookOpen,
  ClipboardCheck, // Kept for potential generic use, but specific labels changed
  LogOut,
  Briefcase,
  BookCopy, // New icon for Academics
} from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { cn } from '@/lib/utils.js'; 
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar'; 

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/courses', label: 'Course Management', icon: BookOpen },
  { href: '/admin/events', label: 'Event Management', icon: CalendarDays },
  { href: '/admin/invoices', label: 'Invoices', icon: FileText },
  { href: '/admin/academics', label: 'Timetable & Attendance', icon: BookCopy }, // Updated
  { href: '/admin/leaves', label: 'Leave Requests', icon: Briefcase },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left"> 
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center gap-2 hover:text-primary-foreground group-data-[collapsible=icon]:justify-center">
          <Logo className="h-8 w-auto text-sidebar-primary flex-shrink-0" />
          <span className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">EduCentral</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
                tooltip={{children: item.label, className: "bg-primary text-primary-foreground"}}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/admin/profile'} tooltip={{children: "Profile", className: "bg-primary text-primary-foreground"}}>
              <Link href="/admin/profile">
                <UserCircle className="h-5 w-5 flex-shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{children: "Logout", className: "bg-primary text-primary-foreground"}}>
              <Link href="/login">
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

    
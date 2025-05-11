
"use client";
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, BookOpen, CalendarCheck2, FileText, AlertTriangle, Building, Activity } from 'lucide-react'; 
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Button, buttonVariants } from '@/components/ui/button'; 
import Link from 'next/link';
import { cn } from '@/lib/utils.js';

const recentActivity = [
  { id: 1, activity: 'New student "Alice Wonderland" added.', timestamp: '2 hours ago', category: 'Users' },
  { id: 2, activity: 'Event "Annual Tech Fest" created.', timestamp: '5 hours ago', category: 'Events' },
  { id: 3, activity: 'Invoice #INV007 generated for semester fees.', timestamp: '1 day ago', category: 'Invoices' },
  { id: 4, activity: 'Dr. Smith updated course "Advanced AI".', timestamp: '2 days ago', category: 'Courses' },
];

const studentsPerDepartmentData = [
  { name: 'Comp Sci', students: 350 },
  { name: 'Mech Eng', students: 220 },
  { name: 'Elec Eng', students: 180 },
  { name: 'Civil Eng', students: 150 },
  { name: 'Biz Admin', students: 280 },
  { name: 'Physics', students: 90 },
];

const upcomingEvents = [
 { id: 1, name: "Guest Lecture: Future of AI", date: "2024-08-15", type: "Lecture" },
 { id: 2, name: "University Sports Meet", date: "2024-09-01", type: "Sports" },
 { id: 3, name: "Coding Hackathon", date: "2024-09-10", type: "Competition" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center"><Activity className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" />Admin Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link 
            href="/admin/users" 
            className={cn(buttonVariants({ variant: 'outline' }), "w-full sm:w-auto")}
          >
            Add User
          </Link>
          <Link 
            href="/admin/events"
            className={cn(buttonVariants({ variant: 'default' }), "w-full sm:w-auto")}
          >
            Create Event
          </Link>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/users" className="block">
          <StatCard title="Total Students" value="1,250" icon={Users} description="+20 this month" iconClassName="text-primary" />
        </Link>
        <Link href="/admin/users" className="block"> 
          <StatCard title="Total Faculty" value="150" icon={Users} description="+5 this month" iconClassName="text-green-500 dark:text-green-400" />
        </Link>
        <Link href="/admin/events" className="block">
          <StatCard title="Upcoming Events" value="5" icon={CalendarCheck2} description="2 within next week" iconClassName="text-purple-500 dark:text-purple-400" />
        </Link>
        <Link href="/admin/invoices" className="block">
          <StatCard title="Pending Invoices" value="25" icon={FileText} description="$12,500 due" iconClassName="text-orange-500 dark:text-orange-400" />
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Link href="/admin/analytics" className="block">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center"><Building className="mr-2 h-5 w-5 text-primary" /> Students per Department</CardTitle>
              <CardDescription>Distribution of students across major departments. Click to see more analytics.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={studentsPerDepartmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{fontSize: 10}}/>
                  <YAxis tick={{fontSize: 10}}/>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                   />
                  <Legend wrapperStyle={{fontSize: '12px'}}/>
                  <Bar dataKey="students" fill="hsl(var(--primary))" name="Students" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Link>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions performed in the system.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.activity}</TableCell>
                    <TableCell className="hidden sm:table-cell">{activity.category}</TableCell>
                    <TableCell className="text-right text-muted-foreground whitespace-nowrap">{activity.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events scheduled in the near future. <Link href="/admin/events" className="text-primary hover:underline text-sm">View All</Link></CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <ul className="space-y-3">
                {upcomingEvents.map(event => (
                 <Link href="/admin/events" key={event.id} className="block">
                  <li className="flex flex-col sm:flex-row items-start justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors gap-2 sm:gap-0">
                    <div>
                      <p className="font-semibold">{event.name}</p>
                      <p className="text-sm text-muted-foreground">{event.type}</p>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">{new Date(event.date).toLocaleDateString()}</p>
                  </li>
                 </Link>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No upcoming events.</p>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive h-5 w-5" /> Quick Alerts</CardTitle>
            <CardDescription>Important system notifications or pending tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-yellow-500/50 bg-yellow-500/10 dark:bg-yellow-700/20 rounded-md gap-2 sm:gap-0">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 flex-1">5 Faculty leave requests pending approval.</p>
              <Link 
                href="/admin/leaves" 
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "w-full sm:w-auto")}
              >
                View
              </Link>
            </div>
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-red-500/50 bg-red-500/10 dark:bg-red-700/20 rounded-md gap-2 sm:gap-0">
              <p className="text-sm text-red-700 dark:text-red-300 flex-1">System backup failed last night.</p>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto">Details</Button>
            </div>
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-blue-500/50 bg-blue-500/10 dark:bg-blue-700/20 rounded-md gap-2 sm:gap-0">
              <p className="text-sm text-blue-700 dark:text-blue-300 flex-1">New software update available for Student Portal.</p>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">Learn More</Button>
            </div>
          </CardContent>
        </Card>
       </div>
    </div>
  );
}

    
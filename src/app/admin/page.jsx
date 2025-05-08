
"use client";
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Users, BookOpen, CalendarCheck2, FileText, DollarSign, AlertTriangle } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const recentActivity = [
  { id: 1, activity: 'New student "Alice Wonderland" added.', timestamp: '2 hours ago', category: 'Users' },
  { id: 2, activity: 'Event "Annual Tech Fest" created.', timestamp: '5 hours ago', category: 'Events' },
  { id: 3, activity: 'Invoice #INV007 generated for semester fees.', timestamp: '1 day ago', category: 'Invoices' },
  { id: 4, activity: 'Dr. Smith updated course "Advanced AI".', timestamp: '2 days ago', category: 'Courses' },
];

const userStatsData = [
  { name: 'Jan', students: 400, faculty: 40 },
  { name: 'Feb', students: 300, faculty: 42 },
  { name: 'Mar', students: 500, faculty: 45 },
  { name: 'Apr', students: 450, faculty: 43 },
  { name: 'May', students: 600, faculty: 48 },
  { name: 'Jun', students: 550, faculty: 50 },
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
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/users/add-student">Add Student</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/events/add">Create Event</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value="1,250" icon={Users} description="+20 this month" iconClassName="text-blue-500" />
        <StatCard title="Total Faculty" value="150" icon={BookOpen} description="+5 this month" iconClassName="text-green-500" />
        <StatCard title="Upcoming Events" value="5" icon={CalendarCheck2} description="2 within next week" iconClassName="text-purple-500" />
        <StatCard title="Pending Invoices" value="25" icon={FileText} description="$12,500 due" iconClassName="text-orange-500" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
            <CardDescription>Student and faculty enrollment over the past 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={userStatsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                 />
                <Legend />
                <Bar dataKey="students" fill="hsl(var(--primary))" name="Students" radius={[4, 4, 0, 0]} />
                <Bar dataKey="faculty" fill="hsl(var(--accent))" name="Faculty" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions performed in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.activity}</TableCell>
                    <TableCell>{activity.category}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{activity.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events scheduled in the near future.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <ul className="space-y-3">
                {upcomingEvents.map(event => (
                  <li key={event.id} className="flex items-start justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold">{event.name}</p>
                      <p className="text-sm text-muted-foreground">{event.type}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No upcoming events.</p>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" /> Quick Alerts</CardTitle>
            <CardDescription>Important system notifications or pending tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-yellow-500/50 bg-yellow-500/10 rounded-md">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">5 Faculty leave requests pending approval.</p>
              <Button variant="outline" size="sm" asChild><Link href="/admin/leaves">View</Link></Button>
            </div>
             <div className="flex items-center justify-between p-3 border border-red-500/50 bg-red-500/10 rounded-md">
              <p className="text-sm text-red-700 dark:text-red-300">System backup failed last night.</p>
              <Button variant="destructive" size="sm">Details</Button>
            </div>
             <div className="flex items-center justify-between p-3 border border-blue-500/50 bg-blue-500/10 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-300">New software update available for Student Portal.</p>
              <Button variant="outline" size="sm">Learn More</Button>
            </div>
          </CardContent>
        </Card>
       </div>
    </div>
  );
}

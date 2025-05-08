
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, FileText, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const monthlyEnrollmentData = [
  { month: 'Jan', students: 50, faculty: 5 },
  { month: 'Feb', students: 55, faculty: 6 },
  { month: 'Mar', students: 60, faculty: 5 },
  { month: 'Apr', students: 65, faculty: 7 },
  { month: 'May', students: 70, faculty: 6 },
  { month: 'Jun', students: 75, faculty: 8 },
];

const coursePopularityData = [
  { name: 'Computer Science', students: 350 },
  { name: 'Business Admin', students: 280 },
  { name: 'Mechanical Eng.', students: 220 },
  { name: 'Electrical Eng.', students: 180 },
  { name: 'Civil Eng.', students: 150 },
];

const financialOverviewData = [
  { name: 'Jan', income: 40000, expenses: 22000 },
  { name: 'Feb', income: 45000, expenses: 25000 },
  { name: 'Mar', income: 50000, expenses: 28000 },
  { name: 'Apr', income: 48000, expenses: 26000 },
  { name: 'May', income: 55000, expenses: 30000 },
  { name: 'Jun', income: 60000, expenses: 32000 },
];

const eventAttendanceData = [
    { event: 'Tech Fest', attendance: 500 },
    { event: 'Cultural Night', attendance: 350 },
    { event: 'Sports Meet', attendance: 420 },
    { event: 'Guest Lecture', attendance: 150 },
    { event: 'Workshop AI', attendance: 80 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center"><BarChart3 className="mr-3 h-8 w-8 text-primary" /> Analytics & Reports</h1>
      <CardDescription>Overview of university performance metrics and trends.</CardDescription>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Enrollments</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (This Month)</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$60,000</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
            <FileText className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">+2 new courses this semester</p>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Event Participation</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,500+</div>
            <p className="text-xs text-muted-foreground">Across 5 major events</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Enrollment Trends</CardTitle>
            <CardDescription>Student and faculty additions over the past 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEnrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="students" fill="hsl(var(--chart-1))" name="New Students" radius={[4, 4, 0, 0]} />
                <Bar dataKey="faculty" fill="hsl(var(--chart-2))" name="New Faculty" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Course Popularity</CardTitle>
            <CardDescription>Distribution of students across major fields/departments.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={coursePopularityData} dataKey="students" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {coursePopularityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Monthly income vs. expenses.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={financialOverviewData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-1))" name="Income" strokeWidth={2} />
                        <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-2))" name="Expenses" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Event Attendance</CardTitle>
                <CardDescription>Attendance numbers for recent major events.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eventAttendanceData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="event" type="category" width={100} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                        <Legend />
                        <Bar dataKey="attendance" fill="hsl(var(--chart-4))" name="Attendees" barSize={20} radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
      <CardDescription className="text-center text-sm pt-4">
        Note: All data shown is for demonstration purposes only.
      </CardDescription>
    </div>
  );
}

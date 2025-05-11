"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, FileText, DollarSign, User, Building, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Student related data
const monthlyEnrollmentData = [ // Students and Faculty
  { month: 'Jan', students: 50, faculty: 5 }, { month: 'Feb', students: 55, faculty: 6 },
  { month: 'Mar', students: 60, faculty: 5 }, { month: 'Apr', students: 65, faculty: 7 },
  { month: 'May', students: 70, faculty: 6 }, { month: 'Jun', students: 75, faculty: 8 },
];
const coursePopularityData = [ // Student distribution
  { name: 'Comp Sci', students: 350 }, { name: 'Biz Admin', students: 280 },
  { name: 'Mech Eng', students: 220 }, { name: 'Elec Eng', students: 180 },
  { name: 'Civil Eng', students: 150 },
];
const studentAttendanceTrend = [ // Overall student attendance %
    { month: 'Jan', attendance: 92 }, { month: 'Feb', attendance: 90 }, { month: 'Mar', attendance: 88 },
    { month: 'Apr', attendance: 91 }, { month: 'May', attendance: 89 }, { month: 'Jun', attendance: 93 },
];


// Faculty related data
const facultyCountByDept = [
    { name: 'Comp Sci', count: 25 }, { name: 'Biz Admin', count: 15 },
    { name: 'Mech Eng', count: 20 }, { name: 'Physics', count: 10 },
];
const facultyLeaveTrend = [ // Approved leaves per month
    { month: 'Jan', leaves: 3 }, { month: 'Feb', leaves: 5 }, { month: 'Mar', leaves: 2 },
    { month: 'Apr', leaves: 4 }, { month: 'May', leaves: 6 }, { month: 'Jun', leaves: 3 },
];


// General data (can be shown for both or as overview)
const financialOverviewData = [
  { name: 'Jan', income: 40000, expenses: 22000 }, { name: 'Feb', income: 45000, expenses: 25000 },
  { name: 'Mar', income: 50000, expenses: 28000 }, { name: 'Apr', income: 48000, expenses: 26000 },
  { name: 'May', income: 55000, expenses: 30000 }, { name: 'Jun', income: 60000, expenses: 32000 },
];
const eventAttendanceData = [
    { event: 'Tech Fest', attendance: 500 }, { event: 'Cultural Night', attendance: 350 },
    { event: 'Sports Meet', attendance: 420 }, { event: 'Guest Lecture', attendance: 150 },
    { event: 'Workshop AI', attendance: 80 },
];

const COLORS_STUDENT = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
const COLORS_FACULTY = ['hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))'];


export default function AnalyticsPage() {
  const [analyticsView, setAnalyticsView] = useState('student'); // 'student' or 'faculty'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center"><BarChart3 className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" /> Analytics & Reports</h1>
        <Select value={analyticsView} onValueChange={setAnalyticsView}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select View" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="student"><Users className="mr-2 h-4 w-4 inline-block"/>Student Analytics</SelectItem>
                <SelectItem value="faculty"><User className="mr-2 h-4 w-4 inline-block"/>Faculty Analytics</SelectItem>
                <SelectItem value="general"> <Activity className="mr-2 h-4 w-4 inline-block"/>General Overview</SelectItem>
            </SelectContent>
        </Select>
      </div>
      <CardDescription>Overview of university performance metrics and trends. Current view: {analyticsView.charAt(0).toUpperCase() + analyticsView.slice(1)}</CardDescription>

      {/* General Stats Cards - Could be dynamic based on view later */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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

      {analyticsView === 'student' && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Course Popularity (Student Distribution)</CardTitle>
                <CardDescription>Students across major fields.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={coursePopularityData} dataKey="students" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} >
                      {coursePopularityData.map((entry, index) => (
                        <Cell key={`cell-coursepop-${index}`} fill={COLORS_STUDENT[index % COLORS_STUDENT.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{fontSize: '12px'}}/>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Monthly Student Attendance Trend</CardTitle>
                <CardDescription>Overall student attendance percentage.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentAttendanceTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{fontSize: 12}}/>
                    <YAxis domain={[70, 100]} tickFormatter={(value) => `${value}%`} tick={{fontSize: 12}}/>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} formatter={(value) => `${value}%`} />
                    <Legend wrapperStyle={{fontSize: '12px'}}/>
                    <Line type="monotone" dataKey="attendance" stroke="hsl(var(--chart-2))" name="Attendance %" strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </div>
      )}

      {analyticsView === 'faculty' && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Faculty Count by Department</CardTitle>
                <CardDescription>Number of faculty members in key departments.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={facultyCountByDept} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{fontSize: 12}}/>
                    <YAxis tick={{fontSize: 12}}/>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend wrapperStyle={{fontSize: '12px'}}/>
                    <Bar dataKey="count" fill="hsl(var(--chart-4))" name="Faculty Count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
             <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Monthly Faculty Leave Trend</CardTitle>
                <CardDescription>Number of approved faculty leaves per month.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={facultyLeaveTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{fontSize: 12}}/>
                    <YAxis tick={{fontSize: 12}}/>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend wrapperStyle={{fontSize: '12px'}}/>
                    <Line type="monotone" dataKey="leaves" stroke="hsl(var(--chart-5))" name="Approved Leaves" strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </div>
      )}
      
      {(analyticsView === 'general' || analyticsView === 'student') && ( // Show enrollment for general and student
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Monthly Enrollment Trends</CardTitle>
            <CardDescription>Student and faculty additions over the past 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEnrollmentData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{fontSize: 12}}/>
                <YAxis tick={{fontSize: 12}}/>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Legend wrapperStyle={{fontSize: '12px'}}/>
                <Bar dataKey="students" fill="hsl(var(--chart-1))" name="New Students" radius={[4, 4, 0, 0]} />
                <Bar dataKey="faculty" fill="hsl(var(--chart-2))" name="New Faculty" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {analyticsView === 'general' && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                    <CardDescription>Monthly income vs. expenses.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={financialOverviewData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{fontSize: 12}}/>
                            <YAxis tick={{fontSize: 12}}/>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                            <Legend wrapperStyle={{fontSize: '12px'}}/>
                            <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-1))" name="Income" strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
                            <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-2))" name="Expenses" strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Event Attendance</CardTitle>
                    <CardDescription>Attendance numbers for recent major events.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={eventAttendanceData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tick={{fontSize: 12}}/>
                            <YAxis dataKey="event" type="category" width={80} tick={{fontSize: 10, width: 75}} interval={0}/>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                            <Legend wrapperStyle={{fontSize: '12px'}}/>
                            <Bar dataKey="attendance" fill="hsl(var(--chart-4))" name="Attendees" barSize={15} radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      )}
      <CardDescription className="text-center text-sm pt-4">
        Note: All data shown is for demonstration purposes only.
      </CardDescription>
    </div>
  );
}

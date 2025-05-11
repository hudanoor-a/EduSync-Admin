
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, FileText, DollarSign, User, Activity, BookOpen, UserCheck, UserX, ArrowDownUp, CheckSquare, PieChart as PieChartIcon, LineChart as LineChartIcon, AreaChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line, PieChart, Pie, Cell, Area } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Student related data
const studentEnrollmentByYear = [
  { year: '2020', students: 800 }, { year: '2021', students: 950 },
  { year: '2022', students: 1100 }, { year: '2023', students: 1250 },
  { year: '2024', students: 1350 },
];
const studentPerformance = [
  { semester: 'Spring 2023', avgGpa: 3.2, passRate: 85 },
  { semester: 'Fall 2023', avgGpa: 3.3, passRate: 88 },
  { semester: 'Spring 2024', avgGpa: 3.1, passRate: 82 },
];
const studentDemographics = [
  { name: 'Undergraduate', value: 1000 },
  { name: 'Graduate', value: 350 },
];
const courseFeedbackScores = [
    { course: 'CS101', avgRating: 4.5 }, { course: 'MA202', avgRating: 4.2 },
    { course: 'PY105', avgRating: 4.0 }, { course: 'BS301', avgRating: 4.6 },
];

// Faculty related data
const facultyPublicationTrend = [
  { year: '2020', publications: 30 }, { year: '2021', publications: 35 },
  { year: '2022', publications: 45 }, { year: '2023', publications: 50 },
  { year: '2024', publications: 55 },
];
const facultyExperienceDistribution = [
  { range: '0-5 Yrs', count: 40 }, { range: '6-10 Yrs', count: 60 },
  { range: '11-15 Yrs', count: 30 }, { range: '15+ Yrs', count: 20 },
];
const facultyWorkload = [
    { faculty: 'Dr. Smith', courses: 3, students: 120 },
    { faculty: 'Dr. Jones', courses: 2, students: 90 },
    { faculty: 'Prof. Green', courses: 4, students: 150 },
];


// General data
const resourceUtilization = [
  { resource: 'Library', usage: 75 }, { resource: 'Labs', usage: 60 },
  { resource: 'Sports Complex', usage: 45 }, { resource: 'Cafeteria', usage: 85 },
];
const budgetAllocation = [
  { department: 'Academics', budget: 400000 }, { department: 'Research', budget: 250000 },
  { department: 'Admin', budget: 150000 }, { department: 'Infrastructure', budget: 200000 },
];

const COLORS_STUDENT = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
const COLORS_FACULTY = ['hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))'];
const COLORS_GENERAL = ['hsl(var(--chart-5))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];


export default function AnalyticsPage() {
  const [analyticsView, setAnalyticsView] = useState('student'); 
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
     if (typeof window !== "undefined") {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center"><BarChart3 className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" /> Analytics & Reports</h1>
        <Select value={analyticsView} onValueChange={setAnalyticsView}>
            <SelectTrigger className="w-full sm:w-[200px]">
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

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Enrollments</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,350</div>
            <p className="text-xs text-muted-foreground">+8% from last year</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Pass Rate</CardTitle>
            <CheckSquare className="h-5 w-5 text-green-500 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Faculty Publications</CardTitle>
            <BookOpen className="h-5 w-5 text-purple-500 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">55</div>
            <p className="text-xs text-muted-foreground">+10% from last year</p>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-orange-500 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.5M</div>
            <p className="text-xs text-muted-foreground">Annual projection</p>
          </CardContent>
        </Card>
      </div>

      {analyticsView === 'student' && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Enrollment Trend by Year</CardTitle>
                <CardDescription>Growth of student population.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studentEnrollmentByYear} margin={{ top: 5, right: 10, left: isMobileView ? -25: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{fontSize: isMobileView ? 10 : 12}}/>
                    <YAxis tick={{fontSize: isMobileView ? 10 : 12}}/>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend wrapperStyle={{fontSize: isMobileView ? '10px' : '12px'}}/>
                    <Area type="monotone" dataKey="students" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} name="Students" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center"><PieChartIcon className="mr-2 h-5 w-5 text-primary"/>Student Demographics</CardTitle>
                <CardDescription>Breakdown of student types.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={studentDemographics} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={isMobileView ? 70 : 90} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} >
                      {studentDemographics.map((entry, index) => (
                        <Cell key={`cell-demographics-${index}`} fill={COLORS_STUDENT[index % COLORS_STUDENT.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{fontSize: isMobileView ? '10px' : '12px'}}/>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
             <Card className="shadow-lg lg:col-span-2"> {/* Spans two columns on large screens */}
              <CardHeader>
                <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/>Student Performance Overview</CardTitle>
                <CardDescription>Average GPA and Pass Rates per semester.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentPerformance} margin={{ top: 5, right: 10, left: isMobileView ? -25: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" tick={{fontSize: isMobileView ? 8 : 10}}/>
                    <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" tick={{fontSize: isMobileView ? 10 : 12}} domain={[2.5, 4.0]}/>
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" tick={{fontSize: isMobileView ? 10 : 12}} domain={[70, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend wrapperStyle={{fontSize: isMobileView ? '10px' : '12px'}}/>
                    <Bar yAxisId="left" dataKey="avgGpa" fill="hsl(var(--chart-1))" name="Avg. GPA" radius={[4, 4, 0, 0]} barSize={isMobileView ? 15 : 20}/>
                    <Line yAxisId="right" type="monotone" dataKey="passRate" stroke="hsl(var(--chart-2))" name="Pass Rate (%)" strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </div>
      )}

      {analyticsView === 'faculty' && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary"/>Faculty Publication Trend</CardTitle>
                <CardDescription>Annual research output.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={facultyPublicationTrend} margin={{ top: 5, right: 10, left: isMobileView ? -25: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{fontSize: isMobileView ? 10 : 12}}/>
                    <YAxis tick={{fontSize: isMobileView ? 10 : 12}}/>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend wrapperStyle={{fontSize: isMobileView ? '10px' : '12px'}}/>
                    <Line type="monotone" dataKey="publications" stroke="hsl(var(--chart-4))" name="Publications" strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
             <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Faculty Experience Distribution</CardTitle>
                <CardDescription>Years of experience among faculty.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={facultyExperienceDistribution} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={isMobileView ? 70 : 90} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {facultyExperienceDistribution.map((entry, index) => (
                            <Cell key={`cell-exp-${index}`} fill={COLORS_FACULTY[index % COLORS_FACULTY.length]} />
                        ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                        <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{fontSize: isMobileView ? '10px' : '12px'}}/>
                    </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </div>
      )}
      
      {analyticsView === 'general' && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><ArrowDownUp className="mr-2 h-5 w-5 text-primary"/>Resource Utilization</CardTitle>
                    <CardDescription>Usage percentage of key university resources.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={resourceUtilization} layout="vertical" margin={{ top: 5, right: 20, left: isMobileView ? 10 : 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tickFormatter={(value) => `${value}%`} tick={{fontSize: isMobileView ? 10 : 12}}/>
                            <YAxis dataKey="resource" type="category" width={isMobileView ? 70 : 100} tick={{fontSize: isMobileView ? 8 : 10, width: isMobileView ? 65 : 95}} interval={0}/>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} formatter={(value) => `${value}%`} />
                            <Legend wrapperStyle={{fontSize: isMobileView ? '10px' : '12px'}}/>
                            <Bar dataKey="usage" fill="hsl(var(--chart-3))" name="Usage %" barSize={isMobileView ? 12 : 20} radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary"/>Departmental Budget Allocation</CardTitle>
                    <CardDescription>Financial distribution across departments.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart >
                            <Pie data={budgetAllocation} dataKey="budget" nameKey="department" cx="50%" cy="50%" outerRadius={isMobileView ? 70 : 90} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {budgetAllocation.map((entry, index) => (
                                <Cell key={`cell-budget-${index}`} fill={COLORS_GENERAL[index % COLORS_GENERAL.length]} />
                            ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} formatter={(value) => `$${value.toLocaleString()}`} />
                            <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{fontSize: isMobileView ? '10px' : '12px'}}/>
                        </PieChart>
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

    
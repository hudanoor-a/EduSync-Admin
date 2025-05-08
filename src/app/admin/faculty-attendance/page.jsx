"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BarChart2, Filter, CalendarIcon as CalendarIconLucide } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'; 
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils.js'; // .js extension

const mockFaculty = [
  { id: 'F001', name: 'Dr. Eleanor Vance', department: 'Physics' },
  { id: 'F002', name: 'Prof. Samuel Green', department: 'Mathematics' },
  { id: 'F003', name: 'Dr. Olivia Chen', department: 'Computer Science' },
];

const generateMockFacultyAttendance = (facultyId, month) => {
  const records = [];
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(month.getFullYear(), month.getMonth(), i);
    if (date.getDay() === 0 || date.getDay() === 6) continue; 

    const randomStatus = Math.random();
    let status;
    let hoursTaught = 0;
    if (randomStatus < 0.85) { 
      status = 'Present';
      hoursTaught = Math.floor(Math.random() * 4) + 2; 
    } else if (randomStatus < 0.95) { 
      status = 'Absent';
    } else { 
      status = 'Leave';
    }
    records.push({ date: format(date, 'yyyy-MM-dd'), status, hoursTaught });
  }
  return records;
};


const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export default function FacultyAttendancePage() {
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [facultyList] = useState(mockFaculty); 
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  
  useEffect(() => {
    if (selectedFacultyId) {
      const records = generateMockFacultyAttendance(selectedFacultyId, selectedMonth);
      setAttendanceRecords(records);

      const presentDays = records.filter(r => r.status === 'Present').length;
      const absentDays = records.filter(r => r.status === 'Absent').length;
      const leaveDays = records.filter(r => r.status === 'Leave').length;
      const totalWorkingDays = records.length;
      const taughtHours = records.filter(r => r.status === 'Present' && r.hoursTaught).reduce((sum, r) => sum + r.hoursTaught, 0);
      const faculty = facultyList.find(f => f.id === selectedFacultyId);

      setAttendanceSummary({
        facultyId: selectedFacultyId,
        facultyName: faculty?.name || 'N/A',
        department: faculty?.department || 'N/A',
        totalDays: totalWorkingDays,
        presentDays,
        absentDays,
        leaveDays,
        avgHoursTaught: presentDays > 0 ? parseFloat((taughtHours / presentDays).toFixed(2)) : 0,
      });

    } else {
      setAttendanceRecords([]);
      setAttendanceSummary(null);
    }
  }, [selectedFacultyId, selectedMonth, facultyList]);

  const pieData = attendanceSummary ? [
    { name: 'Present', value: attendanceSummary.presentDays },
    { name: 'Absent', value: attendanceSummary.absentDays },
    { name: 'Leave', value: attendanceSummary.leaveDays },
  ].filter(item => item.value > 0) : [];


  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center"><BarChart2 className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" /> Faculty Attendance</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5"/> Filters</CardTitle>
          <CardDescription>Select faculty and month to view attendance records.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="faculty-select">Faculty Member</Label>
            <Select value={selectedFacultyId} onValueChange={setSelectedFacultyId}>
              <SelectTrigger id="faculty-select">
                <SelectValue placeholder="Select Faculty" />
              </SelectTrigger>
              <SelectContent>
                {facultyList.map(faculty => (
                  <SelectItem key={faculty.id} value={faculty.id}>
                    {faculty.name} ({faculty.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="month-picker">Month</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="month-picker"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedMonth && "text-muted-foreground"
                  )}
                >
                  <CalendarIconLucide className="mr-2 h-4 w-4" />
                  {selectedMonth ? format(selectedMonth, "MMMM yyyy") : <span>Pick a month</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedMonth}
                  onSelect={(date) => setSelectedMonth(date || new Date())}
                  initialFocus
                  defaultMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  footer={
                    <p className="text-xs text-center p-2 text-muted-foreground">
                      Select any day in the desired month.
                    </p>
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {selectedFacultyId && attendanceSummary ? (
        <>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Attendance Summary: {attendanceSummary.facultyName}</CardTitle>
              <CardDescription>{format(selectedMonth, "MMMM yyyy")} - Dept: {attendanceSummary.department}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="space-y-2 text-sm sm:text-base">
                    <p><strong>Total Working Days:</strong> {attendanceSummary.totalDays}</p>
                    <p><strong>Present:</strong> {attendanceSummary.presentDays} days</p>
                    <p><strong>Absent:</strong> {attendanceSummary.absentDays} days</p>
                    <p><strong>On Leave:</strong> {attendanceSummary.leaveDays} days</p>
                    <p><strong>Avg. Hours Taught:</strong> {attendanceSummary.avgHoursTaught?.toFixed(2) ?? 'N/A'} hrs</p>
                </div>
                <div className="h-[250px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} >
                          {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                      <Legend wrapperStyle={{fontSize: '12px'}}/>
                      </PieChart>
                  </ResponsiveContainer>
                </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Daily Attendance Log</CardTitle>
                <CardDescription>Detailed log for {attendanceSummary.facultyName} in {format(selectedMonth, "MMMM yyyy")}.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
                {attendanceRecords.length > 0 ? (
                <ul className="space-y-2">
                    {attendanceRecords.map(record => (
                    <li key={record.date} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 border rounded-md hover:bg-muted/50 gap-1 sm:gap-0">
                        <span>{format(new Date(record.date), "PPP (E)")}</span>
                        <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium self-start sm:self-center",
                            record.status === 'Present' && "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
                            record.status === 'Absent' && "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100",
                            record.status === 'Leave' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100"
                        )}>{record.status} {record.status === 'Present' && record.hoursTaught ? `(${record.hoursTaught} hrs)` : ''}</span>
                    </li>
                    ))}
                </ul>
                ) : (
                    <p className="text-muted-foreground text-center py-4">No attendance records for this period.</p>
                )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Please select a faculty member and month to view attendance details.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
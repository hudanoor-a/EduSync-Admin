
"use client";
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, BarChart2, Filter, Search } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar } from '@/components/ui/calendar'; // ShadCN Calendar

const fields = ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Business Administration"];
const batches = ["2021", "2022", "2023", "2024"];
const sections = ["A", "B", "C"];
const courses = [
    { id: "CS101", name: "Intro to Programming" },
    { id: "ME202", name: "Thermodynamics" },
    { id: "EE305", name: "Circuit Theory" },
    { id: "BA101", name: "Principles of Management" },
];

// Mock data structure
interface TimetableEntry {
  id: string;
  day: string; // Monday, Tuesday, etc. or specific date for calendar view
  time: string; // e.g., 09:00 - 10:00
  courseName: string;
  courseCode: string;
  facultyName: string;
  roomNo: string;
}

interface AttendanceData {
  course: string;
  present: number;
  absent: number;
  total: number;
}

const mockTimetableData: TimetableEntry[] = [
  { id: 'tt1', day: 'Monday', time: '09:00 - 10:00', courseName: 'Intro to Programming', courseCode: 'CS101', facultyName: 'Dr. Smith', roomNo: 'R101' },
  { id: 'tt2', day: 'Monday', time: '10:00 - 11:00', courseName: 'Thermodynamics', courseCode: 'ME202', facultyName: 'Dr. Jones', roomNo: 'R102' },
  { id: 'tt3', day: 'Tuesday', time: '11:00 - 12:00', courseName: 'Circuit Theory', courseCode: 'EE305', facultyName: 'Dr. Brown', roomNo: 'R103' },
];

const mockAttendanceData: AttendanceData[] = [
  { course: 'CS101', present: 45, absent: 5, total: 50 },
  { course: 'ME202', present: 40, absent: 10, total: 50 },
  { course: 'EE305', present: 35, absent: 15, total: 50 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function StudentTimetableAttendancePage() {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [attendance, setAttendance] = useState<AttendanceData[]>([]);
  const [viewMode, setViewMode] = useState<'timetable' | 'attendance'>('timetable');
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());

  // Fetch data when filters change (simulated)
  useEffect(() => {
    // In a real app, fetch data from /api/students/timetable and /api/students/attendance
    // using selectedFields, selectedBatches, selectedSections
    if (selectedFields.length > 0 && selectedBatches.length > 0 && selectedSections.length > 0) {
      // Simulate API call
      console.log("Fetching data for:", { selectedFields, selectedBatches, selectedSections });
      setTimetable(mockTimetableData); // Filter this based on selected criteria in a real app
      setAttendance(mockAttendanceData); // Filter this based on selected criteria
    } else {
      setTimetable([]);
      setAttendance([]);
    }
  }, [selectedFields, selectedBatches, selectedSections]);

  const handleCheckboxChange = (type: 'field' | 'batch' | 'section', value: string) => {
    const setterMap = {
      field: setSelectedFields,
      batch: setSelectedBatches,
      section: setSelectedSections,
    };
    const currentSelected = {
      field: selectedFields,
      batch: selectedBatches,
      section: selectedSections,
    }[type];

    setterMap[type](
      currentSelected.includes(value)
        ? currentSelected.filter(item => item !== value)
        : [...currentSelected, value]
    );
  };

  const renderCheckboxes = (items: string[], selectedItems: string[], type: 'field' | 'batch' | 'section', groupLabel: string) => (
    <div className="mb-4">
        <h4 className="font-medium mb-2">{groupLabel}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md bg-muted/30">
        {items.map(item => (
            <div key={item} className="flex items-center space-x-2 p-1 rounded hover:bg-muted">
            <Checkbox
                id={`${type}-${item}`}
                checked={selectedItems.includes(item)}
                onCheckedChange={() => handleCheckboxChange(type, item)}
            />
            <Label htmlFor={`${type}-${item}`} className="text-sm font-normal cursor-pointer">{item}</Label>
            </div>
        ))}
        </div>
    </div>
  );

  // A very basic calendar-like display for timetable
  const TimetableCalendarView = () => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "14:00-15:00", "15:00-16:00"]; // Example slots
  
    // Filter timetable for the selected date (mock, needs real date logic)
    const timetableForSelectedDate = timetable; // In real app, filter by calendarDate

    if (timetableForSelectedDate.length === 0 && (selectedFields.length === 0 || selectedBatches.length === 0 || selectedSections.length === 0)) {
        return <p className="text-muted-foreground p-4 text-center">Please select field, batch, and section to view timetable.</p>;
    }
    if (timetableForSelectedDate.length === 0) {
        return <p className="text-muted-foreground p-4 text-center">No timetable data available for the selected criteria or date.</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2">Time</th>
              {daysOfWeek.map(day => (
                <th key={day} className="border border-border p-2">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot}>
                <td className="border border-border p-2 font-medium">{slot}</td>
                {daysOfWeek.map(day => {
                  const entry = timetableForSelectedDate.find(e => e.day === day && e.time.startsWith(slot.split('-')[0]));
                  return (
                    <td key={day} className="border border-border p-2 h-20 align-top">
                      {entry ? (
                        <div className="text-xs bg-primary/10 p-1 rounded">
                          <p className="font-semibold">{entry.courseName} ({entry.courseCode})</p>
                          <p>{entry.facultyName}</p>
                          <p>Room: {entry.roomNo}</p>
                        </div>
                      ) : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

  const AttendanceChartView = () => {
    if (attendance.length === 0 && (selectedFields.length === 0 || selectedBatches.length === 0 || selectedSections.length === 0)) {
        return <p className="text-muted-foreground p-4 text-center">Please select field, batch, and section to view attendance.</p>;
    }
     if (attendance.length === 0) {
        return <p className="text-muted-foreground p-4 text-center">No attendance data available for the selected criteria.</p>;
    }
    const overallAttendance = attendance.reduce((acc, curr) => {
        acc.present += curr.present;
        acc.absent += curr.absent;
        return acc;
    }, {present: 0, absent: 0});

    const overallPieData = [
        { name: 'Present', value: overallAttendance.present },
        { name: 'Absent', value: overallAttendance.absent },
    ];

    return (
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={overallPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {overallPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance by Course</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendance} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="course" type="category" width={80} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="hsl(var(--chart-1))" name="Present" barSize={20} />
                <Bar dataKey="absent" stackId="a" fill="hsl(var(--chart-2))" name="Absent" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center"><CalendarIcon className="mr-3 h-8 w-8 text-primary" /> Student Timetable & Attendance</h1>
        <div className="flex gap-2">
            <Button variant={viewMode === 'timetable' ? 'default' : 'outline'} onClick={() => setViewMode('timetable')}>
                <CalendarIcon className="mr-2 h-4 w-4" /> Timetable
            </Button>
            <Button variant={viewMode === 'attendance' ? 'default' : 'outline'} onClick={() => setViewMode('attendance')}>
                <BarChart2 className="mr-2 h-4 w-4" /> Attendance
            </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5"/> Filters</CardTitle>
          <CardDescription>Select field(s), batch(es), and section(s) to view timetable or attendance. You can select multiple options in each category.</CardDescription>
        </CardHeader>
        <CardContent>
          {renderCheckboxes(fields, selectedFields, 'field', 'Academic Field')}
          {renderCheckboxes(batches, selectedBatches, 'batch', 'Batch Year')}
          {renderCheckboxes(sections, selectedSections, 'section', 'Section')}
        </CardContent>
      </Card>
      
      {viewMode === 'timetable' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Class Timetable</CardTitle>
            {/* Optional: Add a date picker for daily/weekly view if needed */}
            {/* <Calendar mode="single" selected={calendarDate} onSelect={setCalendarDate} className="rounded-md border w-min" /> */}
          </CardHeader>
          <CardContent>
            <TimetableCalendarView />
          </CardContent>
        </Card>
      )}

      {viewMode === 'attendance' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Graphical representation of student attendance.</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceChartView />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

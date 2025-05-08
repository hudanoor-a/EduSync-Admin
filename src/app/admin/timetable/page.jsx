"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIconLucide, BarChart2, Filter } from 'lucide-react'; 
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const fields = ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Business Administration"];
const batches = ["2021", "2022", "2023", "2024"];
const sections = ["A", "B", "C"];

const mockTimetableData = [
  { id: 'tt1', day: 'Monday', time: '09:00 - 10:00', courseName: 'Intro to Prog', courseCode: 'CS101', facultyName: 'Dr. Smith', roomNo: 'R101' }, // Shortened name
  { id: 'tt2', day: 'Monday', time: '10:00 - 11:00', courseName: 'Thermodynamics', courseCode: 'ME202', facultyName: 'Dr. Jones', roomNo: 'R102' },
  { id: 'tt3', day: 'Tuesday', time: '11:00 - 12:00', courseName: 'Circuit Theory', courseCode: 'EE305', facultyName: 'Dr. Brown', roomNo: 'R103' },
  { id: 'tt4', day: 'Wednesday', time: '14:00 - 15:00', courseName: 'Mgmt Principles', courseCode: 'BA101', facultyName: 'Prof. Green', roomNo: 'R104' }, // Shortened name
];

const mockAttendanceData = [
  { course: 'CS101', present: 45, absent: 5, total: 50 },
  { course: 'ME202', present: 40, absent: 10, total: 50 },
  { course: 'EE305', present: 35, absent: 15, total: 50 },
  { course: 'BA101', present: 48, absent: 2, total: 50 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function StudentTimetableAttendancePage() {
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  
  const [timetable, setTimetable] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [viewMode, setViewMode] = useState('timetable');

  useEffect(() => {
    if (selectedFields.length > 0 && selectedBatches.length > 0 && selectedSections.length > 0) {
      console.log("Fetching data for:", { selectedFields, selectedBatches, selectedSections });
      // Filter mock data based on selection (simple example)
      setTimetable(mockTimetableData); // In real app, API would filter
      setAttendance(mockAttendanceData); // In real app, API would filter
    } else {
      setTimetable([]);
      setAttendance([]);
    }
  }, [selectedFields, selectedBatches, selectedSections]);

  const handleCheckboxChange = (type, value) => {
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

  const renderCheckboxes = (items, selectedItems, type, groupLabel) => (
    <div className="mb-4">
        <h4 className="font-medium mb-2 text-sm">{groupLabel}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md bg-muted/30">
        {items.map(item => (
            <div key={item} className="flex items-center space-x-2 p-1 rounded hover:bg-muted">
            <Checkbox
                id={`${type}-${item}`}
                checked={selectedItems.includes(item)}
                onCheckedChange={() => handleCheckboxChange(type, item)}
            />
            <Label htmlFor={`${type}-${item}`} className="text-xs sm:text-sm font-normal cursor-pointer">{item}</Label>
            </div>
        ))}
        </div>
    </div>
  );

  const TimetableCalendarView = () => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"]; 
  
    if (timetable.length === 0 && (selectedFields.length === 0 || selectedBatches.length === 0 || selectedSections.length === 0)) {
        return <p className="text-muted-foreground p-4 text-center">Please select field, batch, and section to view timetable.</p>;
    }
    if (timetable.length === 0) {
        return <p className="text-muted-foreground p-4 text-center">No timetable data available for the selected criteria.</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-border text-xs sm:text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-1 sm:p-2 whitespace-nowrap">Time</th>
              {daysOfWeek.map(day => (
                <th key={day} className="border border-border p-1 sm:p-2">{day.substring(0,3)}</th> // Abbreviate days
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot}>
                <td className="border border-border p-1 sm:p-2 font-medium whitespace-nowrap">{slot.replace(" - ", "-")}</td>
                {daysOfWeek.map(day => {
                  const entry = timetable.find(e => e.day === day && e.time.startsWith(slot.split('-')[0].trim()));
                  return (
                    <td key={day} className="border border-border p-1 h-16 sm:h-20 align-top min-w-[80px] sm:min-w-[100px]">
                      {entry ? (
                        <div className="text-[10px] sm:text-xs bg-primary/10 p-1 rounded h-full flex flex-col justify-center">
                          <p className="font-semibold leading-tight">{entry.courseName}</p>
                          <p className="text-muted-foreground leading-tight">{entry.courseCode}</p>
                          <p className="text-muted-foreground leading-tight">{entry.facultyName}</p>
                          <p className="text-muted-foreground leading-tight">R: {entry.roomNo}</p>
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
    ].filter(item => item.value > 0);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={overallPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {overallPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Legend wrapperStyle={{fontSize: '12px'}}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance by Course</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendance} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{fontSize: 10}}/>
                <YAxis dataKey="course" type="category" width={60} tick={{fontSize: 10}} interval={0}/>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Legend wrapperStyle={{fontSize: '12px'}}/>
                <Bar dataKey="present" stackId="a" fill="hsl(var(--chart-1))" name="Present" barSize={15} />
                <Bar dataKey="absent" stackId="a" fill="hsl(var(--chart-2))" name="Absent" barSize={15} radius={[0, 4, 4, 0]}/>
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
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight flex items-center"><CalendarIconLucide className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8 text-primary" /> Student Timetable & Attendance</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant={viewMode === 'timetable' ? 'default' : 'outline'} onClick={() => setViewMode('timetable')} className="w-full sm:w-auto">
                <CalendarIconLucide className="mr-2 h-4 w-4" /> Timetable
            </Button>
            <Button variant={viewMode === 'attendance' ? 'default' : 'outline'} onClick={() => setViewMode('attendance')} className="w-full sm:w-auto">
                <BarChart2 className="mr-2 h-4 w-4" /> Attendance
            </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5"/> Filters</CardTitle>
          <CardDescription>Select field(s), batch(es), and section(s).</CardDescription>
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
            <CardDescription>Weekly schedule based on selected filters.</CardDescription>
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
            <CardDescription>Graphical representation based on selected filters.</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceChartView />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
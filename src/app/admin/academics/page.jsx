
"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIconLucide, BarChart2, Filter, ChevronLeft, ChevronRight, Users, User, BookCopy } from 'lucide-react'; 
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format, addDays, subDays, startOfDay } from 'date-fns'; // Removed isEqual as it's not used
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from '@/lib/utils.js';

const studentFieldsData = ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Business Administration"];
const studentBatchesData = ["2021", "2022", "2023", "2024"];
const studentSectionsData = ["A", "B", "C"];

const mockFacultyList = [
  { id: 'F001', name: 'Dr. Smith', department: 'Computer Science' },
  { id: 'F002', name: 'Dr. Jones', department: 'Mechanical Engineering' },
  { id: 'F003', name: 'Dr. Brown', department: 'Electrical Engineering' },
  { id: 'F004', name: 'Prof. Green', department: 'Business Administration'},
];

const mockStudentTimetableData = [
  { id: 'tt1', day: 'Monday', time: '09:00 - 10:00', courseName: 'Intro to Prog', courseCode: 'CS101', facultyName: 'Dr. Smith', roomNo: 'R101', field: 'Computer Science', batch: '2023', section: 'A' },
  { id: 'tt2', day: 'Monday', time: '10:00 - 11:00', courseName: 'Thermodynamics', courseCode: 'ME202', facultyName: 'Dr. Jones', roomNo: 'R102', field: 'Mechanical Engineering', batch: '2022', section: 'B'},
  { id: 'tt5', day: 'Monday', time: '11:00 - 12:00', courseName: 'Intro to Prog Lab', courseCode: 'CS101L', facultyName: 'Dr. Smith', roomNo: 'L10', field: 'Computer Science', batch: '2023', section: 'A' },
  { id: 'tt3', day: 'Tuesday', time: '11:00 - 12:00', courseName: 'Circuit Theory', courseCode: 'EE305', facultyName: 'Dr. Brown', roomNo: 'R103', field: 'Electrical Engineering', batch: '2023', section: 'C' },
  { id: 'tt4', day: 'Wednesday', time: '14:00 - 15:00', courseName: 'Mgmt Principles', courseCode: 'BA101', facultyName: 'Prof. Green', roomNo: 'R104', field: 'Business Administration', batch: '2024', section: 'A' },
  { id: 'tt6', day: 'Thursday', time: '09:00 - 10:00', courseName: 'Data Structures', courseCode: 'CS201', facultyName: 'Dr. Smith', roomNo: 'R201', field: 'Computer Science', batch: '2023', section: 'A' },
];

const mockFacultyTimetableData = [
 { id: 'ftt1', day: 'Monday', time: '09:00 - 10:00', courseName: 'Intro to Prog', courseCode: 'CS101', roomNo: 'R101', for: 'CS 2023 A', facultyId: 'F001'},
 { id: 'ftt2', day: 'Monday', time: '11:00 - 12:00', courseName: 'Intro to Prog Lab', courseCode: 'CS101L', roomNo: 'L10', for: 'CS 2023 A', facultyId: 'F001'},
 { id: 'ftt3', day: 'Tuesday', time: '14:00 - 15:00', courseName: 'Advanced Algo', courseCode: 'CS301', roomNo: 'R205', for: 'CS 2022 B', facultyId: 'F001'},
 { id: 'ftt4', day: 'Wednesday', time: '10:00 - 11:00', courseName: 'Thermodynamics', courseCode: 'ME202', roomNo: 'R102', for: 'ME 2022 B', facultyId: 'F002'},
];

const mockStudentAttendanceData = [
  { course: 'CS101', present: 45, absent: 5, total: 50, field: 'Computer Science', batch: '2023', section: 'A' },
  { course: 'ME202', present: 40, absent: 10, total: 50, field: 'Mechanical Engineering', batch: '2022', section: 'B' },
  { course: 'EE305', present: 35, absent: 15, total: 50, field: 'Electrical Engineering', batch: '2023', section: 'C' },
  { course: 'BA101', present: 48, absent: 2, total: 50, field: 'Business Administration', batch: '2024', section: 'A'},
  { course: 'CS201', present: 42, absent: 8, total: 50, field: 'Computer Science', batch: '2023', section: 'A' },
];

const mockFacultyAttendanceData = [ 
    { facultyId: 'F001', month: '2024-07', present: 18, absent: 2, leave: 1 },
    { facultyId: 'F002', month: '2024-07', present: 20, absent: 1, leave: 0 },
    { facultyId: 'F003', month: '2024-07', present: 19, absent: 0, leave: 2 },
    { facultyId: 'F004', month: '2024-07', present: 21, absent: 0, leave: 0 },
];


const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];
const DAYS_OF_WEEK_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AcademicsPage() {
  const [viewType, setViewType] = useState('student'); 
  const [mode, setMode] = useState('timetable'); 
  
  const [selectedFields, setSelectedFields] = useState(studentFieldsData.length > 0 ? [studentFieldsData[0]] : []);
  const [selectedBatches, setSelectedBatches] = useState(studentBatchesData.length > 0 ? [studentBatchesData[0]] : []);
  const [selectedSections, setSelectedSections] = useState(studentSectionsData.length > 0 ? [studentSectionsData[0]] : []);
  
  const [selectedFaculty, setSelectedFaculty] = useState(mockFacultyList.length > 0 ? mockFacultyList[0].id : '');

  const [timetableData, setTimetableData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  const [currentDisplayDate, setCurrentDisplayDate] = useState(startOfDay(new Date()));

  const [isMobileView, setIsMobileView] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    if (typeof window !== "undefined") {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);


  useEffect(() => {
    let filteredTt = [];
    let filteredAtt = [];

    if (viewType === 'student') {
      if (selectedFields.length > 0 && selectedBatches.length > 0 && selectedSections.length > 0) {
        filteredTt = mockStudentTimetableData.filter(item => 
          selectedFields.includes(item.field) &&
          selectedBatches.includes(item.batch) &&
          selectedSections.includes(item.section)
        );
        filteredAtt = mockStudentAttendanceData.filter(item =>
           selectedFields.includes(item.field) &&
           selectedBatches.includes(item.batch) &&
           selectedSections.includes(item.section)
        );
      }
    } else { 
      if (selectedFaculty) {
        filteredTt = mockFacultyTimetableData.filter(item => item.facultyId === selectedFaculty);
        const facultyAttendanceSummary = mockFacultyAttendanceData.find(f => f.facultyId === selectedFaculty);
        if (facultyAttendanceSummary) {
             filteredAtt = [ 
                { name: 'Present', value: facultyAttendanceSummary.present },
                { name: 'Absent', value: facultyAttendanceSummary.absent },
                { name: 'Leave', value: facultyAttendanceSummary.leave },
            ].filter(d => d.value > 0);
        } else {
            filteredAtt = [];
        }
      }
    }
    setTimetableData(filteredTt);
    setAttendanceData(filteredAtt);
  }, [viewType, selectedFields, selectedBatches, selectedSections, selectedFaculty]);

  const handleCheckboxChange = (value, state, setter) => {
    setter(
      state.includes(value)
        ? state.filter(item => item !== value)
        : [...state, value]
    );
  };

  const renderCheckboxes = (items, selectedItems, type, groupLabel, setter) => (
    <div className="mb-4">
        <h4 className="font-medium mb-2 text-sm">{groupLabel}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md bg-muted/30 dark:bg-muted/10">
        {(items || []).map(item => (
            <div key={`${type}-${item}`} className="flex items-center space-x-2 p-1 rounded hover:bg-muted dark:hover:bg-muted/20">
            <Checkbox
                id={`${type}-${item}`}
                checked={selectedItems.includes(item)}
                onCheckedChange={() => handleCheckboxChange(item, selectedItems, setter)}
            />
            <Label htmlFor={`${type}-${item}`} className="text-xs sm:text-sm font-normal cursor-pointer">{item}</Label>
            </div>
        ))}
        </div>
    </div>
  );
  
  const MobileTimetableDayView = () => {
    const dayName = DAYS_OF_WEEK_FULL[currentDisplayDate.getDay()];
    const dayEntries = timetableData
      .filter(e => e.day === dayName)
      .sort((a,b) => a.time.localeCompare(b.time));

    let message = "No classes scheduled for this day.";
    if (viewType === 'student' && (selectedFields.length === 0 || selectedBatches.length === 0 || selectedSections.length === 0)) {
        message = "Please select field, batch, and section.";
    } else if (viewType === 'faculty' && selectedFaculty === '') {
        message = "Please select a faculty member.";
    }

    if (dayEntries.length === 0) {
        return <p className="text-muted-foreground p-4 text-center">{message}</p>;
    }
    
    return (
        <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2"> {/* Added max-h and overflow-y-auto */}
            {dayEntries.map(entry => (
                <Card key={entry.id} className="p-3 bg-primary/5 dark:bg-primary/10">
                    <p className="font-semibold text-sm">{entry.courseName} <span className="text-xs text-muted-foreground">({entry.courseCode})</span></p>
                    <p className="text-xs">Time: {entry.time}</p>
                    <p className="text-xs">Room: {entry.roomNo}</p>
                    {viewType === 'student' && <p className="text-xs">Faculty: {entry.facultyName}</p>}
                    {viewType === 'faculty' && <p className="text-xs">For: {entry.for}</p>}
                </Card>
            ))}
        </div>
    );
  };

  const DesktopTimetableWeekView = () => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"]; 
  
    let message = "No timetable data available for the current selection.";
    if (viewType === 'student' && (selectedFields.length === 0 || selectedBatches.length === 0 || selectedSections.length === 0)) {
        message = "Please select field, batch, and section to view student timetable.";
    } else if (viewType === 'faculty' && selectedFaculty === '') {
        message = "Please select a faculty member to view their timetable.";
    }

    if (timetableData.length === 0) {
        return <p className="text-muted-foreground p-4 text-center">{message}</p>;
    }

    return (
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full border-collapse border border-border text-xs sm:text-sm">
          <thead>
            <tr className="bg-muted dark:bg-muted/20">
              <th className="border border-border p-1 sm:p-2 whitespace-nowrap">Time</th>
              {daysOfWeek.map(day => (
                <th key={day} className="border border-border p-1 sm:p-2">{day.substring(0,3)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot}>
                <td className="border border-border p-1 sm:p-2 font-medium whitespace-nowrap">{slot.replace(" - ", "-")}</td>
                {daysOfWeek.map(day => {
                  const entry = timetableData.find(e => e.day === day && e.time.startsWith(slot.split('-')[0].trim()));
                  return (
                    <td key={`${day}-${slot}`} className="border border-border p-1 h-16 sm:h-20 align-top min-w-[90px] sm:min-w-[120px] overflow-hidden">
                      {entry ? (
                        <div className="text-[10px] sm:text-xs bg-primary/10 dark:bg-primary/20 p-1 rounded h-full flex flex-col justify-center">
                          <p className="font-semibold leading-tight">{entry.courseName} ({entry.courseCode})</p>
                          {viewType === 'student' && <p className="text-muted-foreground leading-tight">{entry.facultyName}</p>}
                          {viewType === 'faculty' && <p className="text-muted-foreground leading-tight">For: {entry.for}</p>}
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
    let message = "No attendance data for the current selection.";
     if (viewType === 'student' && (selectedFields.length === 0 || selectedBatches.length === 0 || selectedSections.length === 0)) {
        message = "Please select field, batch, and section to view student attendance.";
    } else if (viewType === 'faculty' && selectedFaculty === '') {
        message = "Please select a faculty member to view their attendance summary.";
    }
    
    if (attendanceData.length === 0) {
        return <p className="text-muted-foreground p-4 text-center">{message}</p>;
    }

    if (viewType === 'student') {
        const overallAttendance = attendanceData.reduce((acc, curr) => {
            acc.present += curr.present || 0;
            acc.absent += curr.absent || 0;
            return acc;
        }, {present: 0, absent: 0});

        const overallPieData = [
            { name: 'Present', value: overallAttendance.present },
            { name: 'Absent', value: overallAttendance.absent },
        ].filter(item => item.value > 0);
        
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base sm:text-lg">Overall Student Attendance</CardTitle></CardHeader>
              <CardContent className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={overallPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={isMobileView ? 60 : 80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {overallPieData.map((entry, index) => (
                            <Cell key={`cell-overall-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend wrapperStyle={{fontSize: '10px', paddingTop: isMobileView ? '10px' : '0'}}/>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base sm:text-lg">Student Attendance by Course</CardTitle></CardHeader>
              <CardContent className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={attendanceData} layout="vertical" margin={{ top: 5, right: 10, left: isMobileView ? -10 : 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{fontSize: isMobileView ? 8 : 10}}/>
                    <YAxis dataKey="course" type="category" width={isMobileView ? 80 : 100} tick={{fontSize: isMobileView ? 8 : 10}} interval={0} style={{fontSize: isMobileView ? '8px' : '10px'}}/>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend wrapperStyle={{fontSize: '10px'}}/>
                    <Bar dataKey="present" stackId="a" fill="hsl(var(--chart-1))" name="Present" barSize={isMobileView ? 10 : 15} />
                    <Bar dataKey="absent" stackId="a" fill="hsl(var(--chart-2))" name="Absent" barSize={isMobileView ? 10 : 15} radius={[0, 4, 4, 0]}/>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        );
    } else { 
        return (
            <Card>
                <CardHeader><CardTitle className="text-base sm:text-lg">Faculty Attendance Summary</CardTitle></CardHeader>
                <CardContent className="h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={attendanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={isMobileView ? 60 : 80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {attendanceData.map((entry, index) => (
                                    <Cell key={`cell-faculty-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                            <Legend wrapperStyle={{fontSize: '10px', paddingTop: isMobileView ? '10px' : '0'}}/>
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight flex items-center"><BookCopy className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8 text-primary" /> {viewType === 'student' ? 'Student' : 'Faculty'} Academics</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
             <Select value={viewType} onValueChange={(v) => { 
                 setViewType(v); 
                 setTimetableData([]); 
                 setAttendanceData([]); 
                 setSelectedFaculty(mockFacultyList.length > 0 && v === 'faculty' ? mockFacultyList[0].id : ''); 
                 setSelectedFields(studentFieldsData.length > 0 && v === 'student' ? [studentFieldsData[0]] : []); 
                 setSelectedBatches(studentBatchesData.length > 0 && v === 'student' ? [studentBatchesData[0]] : []); 
                 setSelectedSections(studentSectionsData.length > 0 && v === 'student' ? [studentSectionsData[0]] : []);
                }}>
                <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Select View Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="student"><Users className="mr-2 h-4 w-4 inline-block"/>Student</SelectItem>
                    <SelectItem value="faculty"><User className="mr-2 h-4 w-4 inline-block"/>Faculty</SelectItem>
                </SelectContent>
            </Select>
            <Button variant={mode === 'timetable' ? 'default' : 'outline'} onClick={() => setMode('timetable')} className="w-full sm:w-auto">
                <CalendarIconLucide className="mr-2 h-4 w-4" /> Timetable
            </Button>
            <Button variant={mode === 'attendance' ? 'default' : 'outline'} onClick={() => setMode('attendance')} className="w-full sm:w-auto">
                <BarChart2 className="mr-2 h-4 w-4" /> Attendance
            </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-base sm:text-lg"><Filter className="mr-2 h-5 w-5"/> Filters</CardTitle>
          <CardDescription>Select criteria to view data.</CardDescription>
        </CardHeader>
        <CardContent>
          {viewType === 'student' ? (
            <>
              {renderCheckboxes(studentFieldsData, selectedFields, 'field', 'Academic Field', setSelectedFields)}
              {renderCheckboxes(studentBatchesData, selectedBatches, 'batch', 'Batch Year', setSelectedBatches)}
              {renderCheckboxes(studentSectionsData, selectedSections, 'section', 'Section', setSelectedSections)}
            </>
          ) : ( 
            <div className="space-y-1">
              <Label htmlFor="faculty-select">Faculty Member</Label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger id="faculty-select">
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent>
                  {mockFacultyList.map(faculty => (
                    <SelectItem key={faculty.id} value={faculty.id}>
                      {faculty.name} ({faculty.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
      
      {mode === 'timetable' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Class Timetable</CardTitle>
             {isMobileView && (
                <div className="flex items-center justify-between mt-2 gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentDisplayDate(d => subDays(d,1))}><ChevronLeft className="h-4 w-4"/></Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="flex-1 justify-start text-left font-normal text-xs sm:text-sm truncate">
                                <CalendarIconLucide className="mr-2 h-4 w-4" />
                                {format(currentDisplayDate, "EEE, MMM d, yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={currentDisplayDate} onSelect={(d) => d && setCurrentDisplayDate(startOfDay(d))} initialFocus/>
                        </PopoverContent>
                    </Popover>
                    <Button variant="outline" size="icon" onClick={() => setCurrentDisplayDate(d => addDays(d,1))}><ChevronRight className="h-4 w-4"/></Button>
                </div>
            )}
            {!isMobileView && <CardDescription>Weekly schedule based on selected filters.</CardDescription>}
          </CardHeader>
          <CardContent>
            {isMobileView ? <MobileTimetableDayView /> : <DesktopTimetableWeekView />}
          </CardContent>
        </Card>
      )}

      {mode === 'attendance' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Attendance Overview</CardTitle>
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

    
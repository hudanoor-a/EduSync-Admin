"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, PlusCircle, Edit3, Trash2, Search, ListFilter, UploadCloud, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseExcelFile } from '@/services/excel.js';


const initialCourses = [
  { id: 'CSE101', code: 'CSE101', title: 'Introduction to Programming', description: 'Fundamentals of programming using Python.', credits: 3, department: 'Computer Science' },
  { id: 'MAT202', code: 'MAT202', title: 'Linear Algebra', description: 'Matrix theory, vector spaces, and linear transformations.', credits: 4, department: 'Mathematics' },
  { id: 'PHY105', code: 'PHY105', title: 'Classical Mechanics', description: 'Newtonian mechanics, work, energy, and momentum.', credits: 3, department: 'Physics' },
];

const departments = ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Biotechnology", "Physics", "Mathematics", "Chemistry", "English", "Management"].filter(d => d !== "");
const ALL_DEPARTMENTS_FILTER_VALUE = "_ALL_DEPARTMENTS_";

export default function CourseManagementPage() {
  const [courses, setCourses] = useState(initialCourses);
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState(ALL_DEPARTMENTS_FILTER_VALUE);
  
  const [isFormOpen, setIsFormOpen] = useState(false); // For manual add/edit form
  const [currentCourse, setCurrentCourse] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    let currentItems = courses;
    if (searchTerm) {
      currentItems = currentItems.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (filterDepartment && filterDepartment !== ALL_DEPARTMENTS_FILTER_VALUE) {
      currentItems = currentItems.filter(course => course.department === filterDepartment);
    }
    setFilteredCourses(currentItems);
  }, [courses, searchTerm, filterDepartment]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!currentCourse || !currentCourse.code || !currentCourse.title || !currentCourse.credits || !currentCourse.department) {
      toast({ title: "Missing Fields", description: "Please fill all required course details.", variant: "destructive" });
      return;
    }

    const courseData = {
      id: editingCourseId || currentCourse.code || `CRS${Date.now()}`, // Use existing ID or code, or generate new one
      code: currentCourse.code,
      title: currentCourse.title,
      description: currentCourse.description || '',
      credits: Number(currentCourse.credits),
      department: currentCourse.department,
    };

    if (editingCourseId) {
      setCourses(courses.map(c => c.id === editingCourseId ? courseData : c));
      toast({ title: "Course Updated", description: `"${courseData.title}" has been updated.` });
    } else {
      // Check for duplicate course code before adding
      if (courses.some(c => c.code === courseData.code)) {
        toast({ title: "Duplicate Course Code", description: `Course code "${courseData.code}" already exists.`, variant: "destructive" });
        return;
      }
      setCourses([...courses, courseData]);
      toast({ title: "Course Created", description: `"${courseData.title}" has been added.` });
    }
    resetForm();
  };

  const handleEdit = (course) => {
    setCurrentCourse({ ...course });
    setEditingCourseId(course.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (courseId) => {
    const courseToDelete = courses.find(c => c.id === courseId);
    setCourses(courses.filter(c => c.id !== courseId));
    toast({ title: "Course Deleted", description: `Course "${courseToDelete?.title}" has been removed.` });
  };
  
  const resetForm = () => {
    setCurrentCourse(null);
    setEditingCourseId(null);
    setIsFormOpen(false);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select an Excel file to upload.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const parsedData = await parseExcelFile(file); 
      const newCourses = parsedData.map((row, index) => {
        const code = row.code?.toString() || `TEMP_CODE_${Date.now() + index}`;
        return {
          id: row.id?.toString() || code, // Use code as ID if ID is missing
          code: code,
          title: row.title?.toString() || 'Untitled Course',
          description: row.description?.toString() || '',
          credits: Number(row.credits) || 0,
          department: row.department?.toString() || (departments.length > 0 ? departments[0] : 'N/A'),
        };
      }).filter(nc => !courses.some(ec => ec.code === nc.code)); // Filter out courses with existing codes

      const skippedCount = parsedData.length - newCourses.length;

      setCourses(prev => [...prev, ...newCourses]);
      toast({ title: "Upload Successful", description: `${newCourses.length} courses added. ${skippedCount > 0 ? `${skippedCount} courses skipped due to duplicate codes.` : ''}` });
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Upload Failed", description: "Could not process the file. Ensure format is correct.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const renderCourseForm = () => ( // This is for manual add/edit
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>{editingCourseId ? 'Edit Course' : 'Add New Course'}</CardTitle>
        <CardDescription>{editingCourseId ? 'Update the details of the existing course.' : 'Fill in the details for the new course.'}</CardDescription>
      </CardHeader>
      <form onSubmit={handleFormSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course-code">Course Code</Label>
              <Input id="course-code" placeholder="e.g., CSE101" value={currentCourse?.code || ''} onChange={(e) => setCurrentCourse({...currentCourse, code: e.target.value})} required disabled={!!editingCourseId} />
              {editingCourseId && <p className="text-xs text-muted-foreground mt-1">Course code cannot be changed after creation.</p>}
            </div>
            <div>
              <Label htmlFor="course-title">Course Title</Label>
              <Input id="course-title" placeholder="e.g., Introduction to Algorithms" value={currentCourse?.title || ''} onChange={(e) => setCurrentCourse({...currentCourse, title: e.target.value})} required />
            </div>
          </div>
          <div>
            <Label htmlFor="course-description">Description</Label>
            <Textarea id="course-description" placeholder="Detailed information about the course content." value={currentCourse?.description || ''} onChange={(e) => setCurrentCourse({...currentCourse, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course-credits">Credits</Label>
              <Input id="course-credits" type="number" placeholder="e.g., 3" value={currentCourse?.credits || ''} onChange={(e) => setCurrentCourse({...currentCourse, credits: e.target.value === '' ? '' : Number(e.target.value)})} required min="0" />
            </div>
            <div>
              <Label htmlFor="course-department">Department</Label>
              <Select value={currentCourse?.department || ''} onValueChange={(value) => setCurrentCourse({...currentCourse, department: value})} required>
                <SelectTrigger id="course-department"><SelectValue placeholder="Select Department" /></SelectTrigger>
                <SelectContent>{departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-2">
          <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto">Cancel</Button>
          <Button type="submit" className="w-full sm:w-auto">{editingCourseId ? 'Update Course' : 'Add Course'}</Button>
        </CardFooter>
      </form>
    </Card>
  );

  const renderFileUpload = () => (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>Upload Courses via Excel</CardTitle>
        <CardDescription>
            Upload an Excel file (.xlsx, .xls, .csv) with course data. Required columns: code, title, credits, department. Optional: id, description.
            <Button variant="link" size="sm" className="p-0 h-auto ml-1 sm:ml-2 align-baseline" asChild>
                <a href="/templates/course_template.xlsx" download data-ai-hint="download template">Download Template <Download className="ml-1 h-3 w-3"/></a>
            </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <Label htmlFor="course-file-upload" className="block mb-2 text-sm font-medium">Choose Excel File</Label>
            <Input 
            id="course-file-upload" 
            type="file" 
            accept=".xlsx, .xls, .csv"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {file && <p className="text-sm text-muted-foreground mt-2">Selected: {file.name}</p>}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleFileUpload} disabled={uploading || !file} className="w-full md:w-auto">
          <UploadCloud className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Courses'}
        </Button>
      </CardFooter>
    </Card>
  );


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center"><BookOpen className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" /> Course Management</h1>
      </div>
      
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-4">
            <TabsTrigger value="view" onClick={() => setIsFormOpen(false)}>View Courses</TabsTrigger>
            <TabsTrigger value="add" onClick={() => { setCurrentCourse(null); setEditingCourseId(null); setIsFormOpen(true); }}>Add/Edit Manually</TabsTrigger>
            <TabsTrigger value="upload" onClick={() => setIsFormOpen(false)}>Upload Excel</TabsTrigger>
        </TabsList>

        <TabsContent value="view">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Existing Courses</CardTitle>
                <CardDescription>View, edit, or delete university courses.</CardDescription>
                <div className="pt-4 flex flex-col sm:flex-row gap-2 items-center flex-wrap">
                  <div className="relative flex-grow w-full sm:w-auto min-w-[150px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-full"
                    />
                  </div>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Filter by Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_DEPARTMENTS_FILTER_VALUE}>All Departments</SelectItem>
                      {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => {setSearchTerm(''); setFilterDepartment(ALL_DEPARTMENTS_FILTER_VALUE);}} className="w-full sm:w-auto"><ListFilter className="mr-2 h-4 w-4"/>Clear Filters</Button>
                </div>
              </CardHeader>
              <CardContent>
                {filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCourses.map(course => (
                      <Card key={course.id} className="hover:shadow-md transition-shadow flex flex-col">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{course.title} ({course.code})</CardTitle>
                              <p className="text-sm text-muted-foreground">{course.department}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-sm mb-2 line-clamp-3">{course.description || "No description available."}</p>
                          <p className="text-xs text-muted-foreground">Credits: {course.credits}</p>
                        </CardContent>
                        <CardFooter className="pt-3 flex justify-end gap-2 border-t mt-auto">
                            <Button variant="outline" size="sm" onClick={() => { handleEdit(course); document.querySelector('[data-radix-collection-item][value="add"]')?.click(); }}><Edit3 className="mr-1 h-3 w-3" /> Edit</Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm"><Trash2 className="mr-1 h-3 w-3" /> Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the course "{course.title} ({course.code})".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(course.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No courses found matching your criteria.</p>
                )}
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="add">
            {isFormOpen && renderCourseForm()}
            {!isFormOpen && <p className="text-muted-foreground text-center py-4">Select "Add/Edit Manually" tab again or click an "Edit" button on a course to open the form.</p>}
        </TabsContent>

        <TabsContent value="upload">
          {renderFileUpload()}
        </TabsContent>
      </Tabs>
    </div>
  );
}

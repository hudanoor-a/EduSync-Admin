
"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Edit3, UploadCloud, Search, Filter, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseExcelFile, type ExcelData } from '@/services/excel'; // Assuming excel service exists

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty';
  field?: string; // for students
  batch?: string; // for students
  section?: string; // for students
  department?: string; // for faculty
}

const initialUsers: User[] = [
  { id: 'S001', name: 'Alice Johnson', email: 'alice@example.com', role: 'student', field: 'Computer Science', batch: '2023', section: 'A' },
  { id: 'S002', name: 'Bob Williams', email: 'bob@example.com', role: 'student', field: 'Mechanical Engineering', batch: '2022', section: 'B' },
  { id: 'F001', name: 'Dr. Carol White', email: 'carol@example.com', role: 'faculty', department: 'Physics' },
  { id: 'F002', name: 'Prof. David Brown', email: 'david@example.com', role: 'faculty', department: 'Mathematics' },
];

const fields = ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Biotechnology"];
const batches = ["2021", "2022", "2023", "2024"];
const sections = ["A", "B", "C", "D"];
const departments = ["Physics", "Mathematics", "Chemistry", "English", "Management"];


export default function UserManagementPage() {
  const [userType, setUserType] = useState<'student' | 'faculty'>('student');
  const [actionType, setActionType] = useState<'add' | 'edit'>('add');
  
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});

  const { toast } = useToast();

  useEffect(() => {
    let currentUsers = users.filter(u => u.role === userType);
    if (searchTerm) {
      currentUsers = currentUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredUsers(currentUsers);
  }, [userType, searchTerm, users]);


  const handleFileUpload = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select an Excel file to upload.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      // This is where you would send the file to a backend API
      // For demo, we parse it on client (not recommended for large files or production)
      const parsedData: ExcelData[] = await parseExcelFile(file);
      
      // Example: map ExcelData to User object. Adjust based on your Excel structure
      const newUsers: User[] = parsedData.map((row, index) => ({
        id: row.id?.toString() || `NEW${userType.charAt(0).toUpperCase()}${Date.now() + index}`,
        name: row.name?.toString() || 'N/A',
        email: row.email?.toString() || 'N/A',
        role: userType,
        ...(userType === 'student' && {
          field: selectedField || row.field?.toString() || 'N/A',
          batch: selectedBatch || row.batch?.toString() || 'N/A',
          section: selectedSection || row.section?.toString() || 'N/A',
        }),
        ...(userType === 'faculty' && {
          department: selectedDepartment || row.department?.toString() || 'N/A',
        }),
      }));

      // Simulate API call to add users
      // In real app: await fetch('/api/users/create-bulk', { method: 'POST', body: JSON.stringify(newUsers) });
      setUsers(prev => [...prev, ...newUsers]);

      toast({ title: "Upload Successful", description: `${newUsers.length} users added from ${file.name}.` });
      setFile(null);
      setSelectedField('');
      setSelectedBatch('');
      setSelectedSection('');
      setSelectedDepartment('');
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Upload Failed", description: "Could not process the file.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setEditFormData(user);
    setActionType('edit'); // Switch to edit tab view
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    // Simulate API call to update user
    // In real app: await fetch(`/api/users/update/${editUser.id}`, { method: 'PUT', body: JSON.stringify(editFormData) });
    
    setUsers(prevUsers => prevUsers.map(u => u.id === editUser.id ? { ...u, ...editFormData } : u));
    toast({ title: "User Updated", description: `${editFormData.name || editUser.name} details saved.` });
    setEditUser(null);
    setEditFormData({});
    // Optionally, switch back to 'add' or stay in 'edit' for another user
  };

  const handleAddNewManual = async (newUser: Partial<User>) => {
     // Simulate API call to add user
    // In real app: await fetch('/api/users/create', { method: 'POST', body: JSON.stringify(completeNewUser) });
    const completeNewUser: User = {
      id: `NEW${userType.charAt(0).toUpperCase()}${Date.now()}`,
      name: newUser.name || 'N/A',
      email: newUser.email || 'N/A',
      role: userType,
      ...(userType === 'student' && {
        field: newUser.field || 'N/A',
        batch: newUser.batch || 'N/A',
        section: newUser.section || 'N/A',
      }),
      ...(userType === 'faculty' && {
        department: newUser.department || 'N/A',
      }),
    };
    setUsers(prev => [...prev, completeNewUser]);
    toast({ title: "User Added", description: `${completeNewUser.name} added successfully.` });
  };


  const renderAddForm = () => (
    <Tabs defaultValue="manual" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="manual">Add Manually</TabsTrigger>
        <TabsTrigger value="upload">Upload Excel</TabsTrigger>
      </TabsList>
      <TabsContent value="manual">
        <ManualAddForm userType={userType} onSubmit={handleAddNewManual} />
      </TabsContent>
      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Upload {userType === 'student' ? 'Students' : 'Faculty'} via Excel</CardTitle>
            <CardDescription>
              Upload an Excel file (.xlsx, .xls, .csv) with user data.
              <Button variant="link" size="sm" className="p-0 h-auto ml-2" asChild>
                <a href="/templates/user_template.xlsx" download data-ai-hint="download template">Download Template <Download className="ml-1 h-3 w-3"/></a>
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userType === 'student' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="student-field">Field</Label>
                  <Select value={selectedField} onValueChange={setSelectedField}>
                    <SelectTrigger id="student-field"><SelectValue placeholder="Select Field" /></SelectTrigger>
                    <SelectContent>{fields.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="student-batch">Batch</Label>
                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger id="student-batch"><SelectValue placeholder="Select Batch" /></SelectTrigger>
                    <SelectContent>{batches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="student-section">Section</Label>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger id="student-section"><SelectValue placeholder="Select Section" /></SelectTrigger>
                    <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {userType === 'faculty' && (
              <div>
                <Label htmlFor="faculty-department">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger id="faculty-department"><SelectValue placeholder="Select Department" /></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="file-upload" className="block mb-2 text-sm font-medium">Choose Excel File</Label>
              <Input 
                id="file-upload" 
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
              {uploading ? 'Uploading...' : `Upload ${userType === 'student' ? 'Students' : 'Faculty'}`}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );

  const renderEditForm = () => (
    editUser ? (
      <Card>
        <CardHeader>
          <CardTitle>Edit {editUser.role === 'student' ? 'Student' : 'Faculty'}: {editUser.name}</CardTitle>
          <CardDescription>Modify the user details below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" value={editFormData.name || ''} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} />
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" type="email" value={editFormData.email || ''} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} />
          </div>
          {editUser.role === 'student' && (
            <>
              <div>
                <Label htmlFor="edit-student-field">Field</Label>
                <Select value={editFormData.field || ''} onValueChange={(value) => setEditFormData({...editFormData, field: value})}>
                  <SelectTrigger id="edit-student-field"><SelectValue placeholder="Select Field" /></SelectTrigger>
                  <SelectContent>{fields.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-student-batch">Batch</Label>
                 <Select value={editFormData.batch || ''} onValueChange={(value) => setEditFormData({...editFormData, batch: value})}>
                  <SelectTrigger id="edit-student-batch"><SelectValue placeholder="Select Batch" /></SelectTrigger>
                  <SelectContent>{batches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-student-section">Section</Label>
                <Select value={editFormData.section || ''} onValueChange={(value) => setEditFormData({...editFormData, section: value})}>
                  <SelectTrigger id="edit-student-section"><SelectValue placeholder="Select Section" /></SelectTrigger>
                  <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          )}
          {editUser.role === 'faculty' && (
            <div>
              <Label htmlFor="edit-faculty-department">Department</Label>
              <Select value={editFormData.department || ''} onValueChange={(value) => setEditFormData({...editFormData, department: value})}>
                <SelectTrigger id="edit-faculty-department"><SelectValue placeholder="Select Department" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save Changes</Button>
        </CardFooter>
      </Card>
    ) : (
      <Card>
        <CardHeader>
          <CardTitle>Edit Users</CardTitle>
          <CardDescription>Search for a user to edit their information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input 
              type="search" 
              placeholder={`Search ${userType}s by ID, name, or email...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button variant="outline" size="icon"><Search className="h-4 w-4"/></Button>
          </div>
          <div className="max-h-96 overflow-y-auto border rounded-md">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{user.name} <span className="text-xs text-muted-foreground">({user.id})</span></p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-muted-foreground">No users found matching your criteria.</p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center"><Users className="mr-3 h-8 w-8 text-primary" /> User Management</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <Card className="w-full md:w-1/3 lg:w-1/4 shadow-lg">
          <CardHeader>
            <CardTitle>Select Options</CardTitle>
            <CardDescription>Choose user type and action.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>User Type</Label>
              <Select value={userType} onValueChange={(value: 'student' | 'faculty') => {setUserType(value); setEditUser(null); setSearchTerm('');}}>
                <SelectTrigger><SelectValue placeholder="Select User Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Action</Label>
              <Select value={actionType} onValueChange={(value: 'add' | 'edit') => {setActionType(value); setEditUser(null);}}>
                <SelectTrigger><SelectValue placeholder="Select Action" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="add"><UserPlus className="inline mr-2 h-4 w-4" /> Add Users</SelectItem>
                  <SelectItem value="edit"><Edit3 className="inline mr-2 h-4 w-4" /> Edit Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          {actionType === 'add' ? renderAddForm() : renderEditForm()}
        </div>
      </div>
    </div>
  );
}


interface ManualAddFormProps {
  userType: 'student' | 'faculty';
  onSubmit: (data: Partial<User>) => void;
}

function ManualAddForm({ userType, onSubmit }: ManualAddFormProps) {
  const [formData, setFormData] = useState<Partial<User>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({}); // Reset form
  };

  return (
     <Card>
      <CardHeader>
        <CardTitle>Add New {userType === 'student' ? 'Student' : 'Faculty'} Manually</CardTitle>
        <CardDescription>Fill in the details for the new user.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="manual-name">Name</Label>
            <Input id="manual-name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <Label htmlFor="manual-email">Email</Label>
            <Input id="manual-email" type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          {userType === 'student' && (
            <>
              <div>
                <Label htmlFor="manual-student-field">Field</Label>
                <Select value={formData.field || ''} onValueChange={(value) => setFormData({...formData, field: value})} required>
                  <SelectTrigger id="manual-student-field"><SelectValue placeholder="Select Field" /></SelectTrigger>
                  <SelectContent>{fields.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="manual-student-batch">Batch</Label>
                 <Select value={formData.batch || ''} onValueChange={(value) => setFormData({...formData, batch: value})} required>
                  <SelectTrigger id="manual-student-batch"><SelectValue placeholder="Select Batch" /></SelectTrigger>
                  <SelectContent>{batches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="manual-student-section">Section</Label>
                <Select value={formData.section || ''} onValueChange={(value) => setFormData({...formData, section: value})} required>
                  <SelectTrigger id="manual-student-section"><SelectValue placeholder="Select Section" /></SelectTrigger>
                  <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          )}
          {userType === 'faculty' && (
            <div>
              <Label htmlFor="manual-faculty-department">Department</Label>
              <Select value={formData.department || ''} onValueChange={(value) => setFormData({...formData, department: value})} required>
                <SelectTrigger id="manual-faculty-department"><SelectValue placeholder="Select Department" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full md:w-auto">
            <UserPlus className="mr-2 h-4 w-4" /> Add {userType === 'student' ? 'Student' : 'Faculty'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

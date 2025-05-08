"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Edit3, UploadCloud, Search, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js'; // .js extension
import { parseExcelFile } from '@/services/excel.js'; // .js extension


const initialUsers = [
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
  const [userType, setUserType] = useState('student');
  const [actionType, setActionType] = useState('add');
  
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // States specifically for the bulk upload filters
  const [uploadField, setUploadField] = useState('');
  const [uploadBatch, setUploadBatch] = useState('');
  const [uploadSection, setUploadSection] = useState('');
  const [uploadDepartment, setUploadDepartment] = useState('');
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [editUser, setEditUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const { toast } = useToast();

  // Filter users based on type and search term for the "Edit Users" list
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
      const parsedData = await parseExcelFile(file);
      
      const newUsers = parsedData.map((row, index) => ({
        id: row.id?.toString() || `NEW${userType.charAt(0).toUpperCase()}${Date.now() + index}`,
        name: row.name?.toString() || 'N/A',
        email: row.email?.toString() || 'N/A',
        role: userType,
        ...(userType === 'student' && {
          // Prioritize filters over file data if filters are set
          field: uploadField || row.field?.toString() || 'N/A',
          batch: uploadBatch || row.batch?.toString() || 'N/A',
          section: uploadSection || row.section?.toString() || 'N/A',
        }),
        ...(userType === 'faculty' && {
          // Prioritize filter over file data
          department: uploadDepartment || row.department?.toString() || 'N/A',
        }),
      }));

      setUsers(prev => [...prev, ...newUsers]);

      toast({ title: "Upload Successful", description: `${newUsers.length} users added from ${file.name}.` });
      setFile(null);
      // Reset upload filters after successful upload
      setUploadField('');
      setUploadBatch('');
      setUploadSection('');
      setUploadDepartment('');
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Upload Failed", description: "Could not process the file.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setEditFormData(user);
    setActionType('edit'); 
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    
    setUsers(prevUsers => prevUsers.map(u => u.id === editUser.id ? { ...u, ...editFormData } : u));
    toast({ title: "User Updated", description: `${editFormData.name || editUser.name} details saved.` });
    setEditUser(null); // Close edit form
    setEditFormData({});
    //setActionType('add'); // Optionally switch back to add tab
  };

   const handleCancelEdit = () => {
    setEditUser(null);
    setEditFormData({});
    // Optionally switch back to 'add' tab if desired
    // setActionType('add');
  };


  const handleAddNewManual = async (newUser) => {
    const completeNewUser = {
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
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-4">
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
              Set default values below (optional, overrides file values if set). Upload an Excel file (.xlsx, .xls, .csv).
              <Button variant="link" size="sm" className="p-0 h-auto ml-1 sm:ml-2" asChild>
                <a href="/templates/user_template.xlsx" download data-ai-hint="download template">Download Template <Download className="ml-1 h-3 w-3"/></a>
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userType === 'student' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="upload-student-field">Default Field</Label>
                  <Select value={uploadField} onValueChange={(v) => setUploadField(v || '')}>
                    <SelectTrigger id="upload-student-field"><SelectValue placeholder="Optional Default" /></SelectTrigger>
                    <SelectContent>{fields.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="upload-student-batch">Default Batch</Label>
                  <Select value={uploadBatch} onValueChange={(v) => setUploadBatch(v || '')}>
                    <SelectTrigger id="upload-student-batch"><SelectValue placeholder="Optional Default" /></SelectTrigger>
                    <SelectContent>{batches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="upload-student-section">Default Section</Label>
                  <Select value={uploadSection} onValueChange={(v) => setUploadSection(v || '')}>
                    <SelectTrigger id="upload-student-section"><SelectValue placeholder="Optional Default" /></SelectTrigger>
                    <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {userType === 'faculty' && (
              <div>
                <Label htmlFor="upload-faculty-department">Default Department</Label>
                <Select value={uploadDepartment} onValueChange={(v) => setUploadDepartment(v || '')}>
                  <SelectTrigger id="upload-faculty-department"><SelectValue placeholder="Optional Default" /></SelectTrigger>
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
            <Input id="edit-name" value={editFormData.name || ''} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} required />
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" type="email" value={editFormData.email || ''} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} required />
          </div>
          {editUser.role === 'student' && (
            <>
              <div>
                <Label htmlFor="edit-student-field">Field</Label>
                <Select value={editFormData.field || ''} onValueChange={(value) => setEditFormData({...editFormData, field: value})} required>
                  <SelectTrigger id="edit-student-field"><SelectValue placeholder="Select Field" /></SelectTrigger>
                  <SelectContent>{fields.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-student-batch">Batch</Label>
                 <Select value={editFormData.batch || ''} onValueChange={(value) => setEditFormData({...editFormData, batch: value})} required>
                  <SelectTrigger id="edit-student-batch"><SelectValue placeholder="Select Batch" /></SelectTrigger>
                  <SelectContent>{batches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-student-section">Section</Label>
                <Select value={editFormData.section || ''} onValueChange={(value) => setEditFormData({...editFormData, section: value})} required>
                  <SelectTrigger id="edit-student-section"><SelectValue placeholder="Select Section" /></SelectTrigger>
                  <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          )}
          {editUser.role === 'faculty' && (
            <div>
              <Label htmlFor="edit-faculty-department">Department</Label>
              <Select value={editFormData.department || ''} onValueChange={(value) => setEditFormData({...editFormData, department: value})} required>
                <SelectTrigger id="edit-faculty-department"><SelectValue placeholder="Select Department" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-2">
          <Button variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto">Cancel</Button>
          <Button onClick={handleSaveEdit} className="w-full sm:w-auto">Save Changes</Button>
        </CardFooter>
      </Card>
    ) : (
      <Card>
        <CardHeader>
          <CardTitle>Edit Users</CardTitle>
          <CardDescription>Search for a user below to edit their information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder={`Search ${userType}s by ID, name, or email...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <div className="max-h-96 overflow-y-auto border rounded-md">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50 gap-2 sm:gap-4">
                  <div>
                    <p className="font-medium">{user.name} <span className="text-xs text-muted-foreground">({user.id})</span></p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEditUser(user)} className="w-full sm:w-auto self-end sm:self-center">
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center"><Users className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" /> User Management</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Options Card */}
        <Card className="w-full md:w-1/3 lg:w-1/4 shadow-lg self-start md:sticky md:top-4">
          <CardHeader>
            <CardTitle>Options</CardTitle>
            <CardDescription>Choose user type and action.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>User Type</Label>
              <Select value={userType} onValueChange={(value) => {setUserType(value || 'student'); setEditUser(null); setSearchTerm('');}}>
                <SelectTrigger><SelectValue placeholder="Select User Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Action</Label>
              <Select value={actionType} onValueChange={(value) => {setActionType(value || 'add'); setEditUser(null);}}>
                <SelectTrigger><SelectValue placeholder="Select Action" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="add"><UserPlus className="inline mr-2 h-4 w-4" /> Add Users</SelectItem>
                  <SelectItem value="edit"><Edit3 className="inline mr-2 h-4 w-4" /> Edit Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Action Area */}
        <div className="flex-1 w-full md:w-2/3 lg:w-3/4">
          {actionType === 'add' ? renderAddForm() : renderEditForm()}
        </div>
      </div>
    </div>
  );
}


function ManualAddForm({ userType, onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || 
        (userType === 'student' && (!formData.field || !formData.batch || !formData.section)) ||
        (userType === 'faculty' && !formData.department)) {
        toast({title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive"});
        return;
    }
    onSubmit(formData);
    setFormData({}); // Reset form
  };

  const { toast } = useToast(); // Need toast here too for validation

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
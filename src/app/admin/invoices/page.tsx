
"use client";
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Edit3, Trash2, Search, Filter, PlusCircle, Bot, CalendarIcon, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateInvoiceDescriptions, type GenerateInvoiceDescriptionsInput } from '@/ai/flows/generate-invoice-descriptions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, getYear, getMonth } from 'date-fns';
import { cn } from '@/lib/utils';


interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  studentId: string;
  studentName: string; // denormalized for display
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'Pending' | 'Paid' | 'Overdue';
  type: 'Semester Fees' | 'Hostel Dues' | 'Exam Fees' | 'Other';
}

const initialInvoices: Invoice[] = [
  { id: 'INV001', studentId: 'S001', studentName: 'Alice Johnson', issueDate: new Date(2024, 0, 15), dueDate: new Date(2024, 0, 30), items: [{id: 'item1', description: 'Semester Fees - Spring 2024', quantity: 1, unitPrice: 1200, total: 1200}], totalAmount: 1200, status: 'Paid', type: 'Semester Fees' },
  { id: 'INV002', studentId: 'S002', studentName: 'Bob Williams', issueDate: new Date(2024, 0, 20), dueDate: new Date(2024, 1, 5), items: [{id: 'item1', description: 'Hostel Dues - January 2024', quantity: 1, unitPrice: 300, total: 300}], totalAmount: 300, status: 'Pending', type: 'Hostel Dues' },
  { id: 'INV003', studentId: 'S001', studentName: 'Alice Johnson', issueDate: new Date(2024, 1, 1), dueDate: new Date(2024, 1, 15), items: [{id: 'item1', description: 'Hostel Dues - February 2024', quantity: 1, unitPrice: 300, total: 300}], totalAmount: 300, status: 'Overdue', type: 'Hostel Dues' },
];

const students = [
  { id: 'S001', name: 'Alice Johnson' },
  { id: 'S002', name: 'Bob Williams' },
  { id: 'S003', name: 'Charlie Brown' },
]; // In real app, this would come from API/DB

const invoiceTypes = ['Semester Fees', 'Hostel Dues', 'Exam Fees', 'Other'];
const invoiceStatuses = ['Pending', 'Paid', 'Overdue'];
const semesters = ["Spring", "Summer", "Fall", "Winter"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


export default function InvoiceManagementPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(invoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice> | null>(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);

  const [isAIGenerationOpen, setIsAIGenerationOpen] = useState(false);
  const [aiInvoiceType, setAiInvoiceType] = useState<'semesterFees' | 'hostelDues'>('semesterFees');
  const [aiTargetDate, setAiTargetDate] = useState<Date>(new Date());
  const [aiSemester, setAiSemester] = useState<string>(semesters[0]);
  const [aiGenerating, setAiGenerating] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    let currentItems = invoices;
    if (searchTerm) {
      currentItems = currentItems.filter(inv =>
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus) {
      currentItems = currentItems.filter(inv => inv.status === filterStatus);
    }
    if (filterType) {
      currentItems = currentItems.filter(inv => inv.type === filterType);
    }
    setFilteredInvoices(currentItems.sort((a,b) => b.issueDate.getTime() - a.issueDate.getTime()));
  }, [invoices, searchTerm, filterStatus, filterType]);


  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentInvoice || !currentInvoice.studentId || !currentInvoice.issueDate || !currentInvoice.dueDate || !currentInvoice.items || currentInvoice.items.length === 0 || !currentInvoice.type || !currentInvoice.status) {
      toast({ title: "Missing Fields", description: "Please fill all required invoice details.", variant: "destructive" });
      return;
    }

    const student = students.find(s => s.id === currentInvoice.studentId);
    if (!student) {
       toast({ title: "Invalid Student", description: "Selected student not found.", variant: "destructive" });
       return;
    }
    
    const totalAmount = currentInvoice.items.reduce((sum, item) => sum + (item.total || 0), 0);

    const invoiceData: Invoice = {
      id: editingInvoiceId || `INV${Date.now()}`,
      studentId: currentInvoice.studentId,
      studentName: student.name,
      issueDate: currentInvoice.issueDate,
      dueDate: currentInvoice.dueDate,
      items: currentInvoice.items as InvoiceItem[], // Cast as it should be valid by now
      totalAmount: totalAmount,
      status: currentInvoice.status as Invoice['status'],
      type: currentInvoice.type as Invoice['type'],
    };

    if (editingInvoiceId) {
      // Simulate API PUT /api/invoices/{id}
      setInvoices(invoices.map(inv => inv.id === editingInvoiceId ? invoiceData : inv));
      toast({ title: "Invoice Updated", description: `Invoice ${invoiceData.id} has been updated.` });
    } else {
      // Simulate API POST /api/invoices
      setInvoices([...invoices, invoiceData]);
      toast({ title: "Invoice Created", description: `Invoice ${invoiceData.id} has been created.` });
    }
    resetForm();
  };

  const handleEdit = (invoice: Invoice) => {
    setCurrentInvoice({ ...invoice, items: invoice.items.map(item => ({...item})) }); // Deep copy items
    setEditingInvoiceId(invoice.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (invoiceId: string) => {
    // Simulate API DELETE /api/invoices/{id}
    setInvoices(invoices.filter(inv => inv.id !== invoiceId));
    toast({ title: "Invoice Deleted", description: `Invoice ${invoiceId} has been removed.` });
  };
  
  const resetForm = () => {
    setCurrentInvoice(null);
    setEditingInvoiceId(null);
    setIsFormOpen(false);
  };

  const handleAddItem = () => {
    setCurrentInvoice(prev => ({
      ...prev,
      items: [...(prev?.items || []), { id: `item${Date.now()}`, description: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setCurrentInvoice(prev => {
      if (!prev || !prev.items) return prev;
      const newItems = [...prev.items];
      const item = { ...newItems[index] };
      (item[field] as any) = value; // Type assertion for simplicity

      if (field === 'quantity' || field === 'unitPrice') {
        item.total = (item.quantity || 0) * (item.unitPrice || 0);
      }
      newItems[index] = item;
      return { ...prev, items: newItems };
    });
  };
  
  const handleRemoveItem = (index: number) => {
    setCurrentInvoice(prev => ({
      ...prev,
      items: prev?.items?.filter((_, i) => i !== index) || []
    }));
  };

  const currentYear = getYear(new Date());
  const years = Array.from({length: 5}, (_, i) => (currentYear - 2 + i).toString());

  const handleAIGenerateInvoices = async () => {
    setAiGenerating(true);
    const year = getYear(aiTargetDate).toString();
    let month: string | undefined = undefined;
    let semesterInput: string | undefined = undefined;

    if (aiInvoiceType === 'hostelDues') {
      month = months[getMonth(aiTargetDate)];
    } else {
      semesterInput = aiSemester;
    }

    const input: GenerateInvoiceDescriptionsInput = {
      invoiceType: aiInvoiceType,
      semester: semesterInput,
      month: month,
      year: year,
    };

    try {
      // In a real app, this might call a backend that then calls the Genkit flow
      // and generates invoices for all relevant students.
      // For this demo, we'll generate one sample description.
      const result = await generateInvoiceDescriptions(input);
      const description = result.description;
      
      // Create dummy invoices for all students (example)
      const newAiInvoices: Invoice[] = students.map(student => ({
        id: `AI_INV${Date.now()}_${student.id}`,
        studentId: student.id,
        studentName: student.name,
        issueDate: aiTargetDate,
        dueDate: new Date(new Date(aiTargetDate).setDate(aiTargetDate.getDate() + 15)), // Due in 15 days
        items: [{
          id: 'ai_item1',
          description: description,
          quantity: 1,
          unitPrice: aiInvoiceType === 'semesterFees' ? 1500 : 350, // Example prices
          total: aiInvoiceType === 'semesterFees' ? 1500 : 350,
        }],
        totalAmount: aiInvoiceType === 'semesterFees' ? 1500 : 350,
        status: 'Pending',
        type: aiInvoiceType === 'semesterFees' ? 'Semester Fees' : 'Hostel Dues',
      }));

      setInvoices(prev => [...prev, ...newAiInvoices]);
      toast({ title: "AI Invoices Generated", description: `${newAiInvoices.length} ${aiInvoiceType === 'semesterFees' ? 'semester fee' : 'hostel due'} invoices generated for ${month ? month + ', ' : ''}${semesterInput ? semesterInput + ', ' : ''}${year}.` });
      setIsAIGenerationOpen(false);

    } catch (error) {
      console.error("AI Generation Error:", error);
      toast({ title: "AI Generation Failed", description: "Could not generate invoices.", variant: "destructive" });
    } finally {
      setAiGenerating(false);
    }
  };


  const renderAIGenerationForm = () => (
    <DialogModal
      isOpen={isAIGenerationOpen}
      onClose={() => setIsAIGenerationOpen(false)}
      title="Generate Invoices with AI"
      description="Automatically generate semester fees or monthly hostel dues."
    >
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="ai-invoice-type">Invoice Type</Label>
          <Select value={aiInvoiceType} onValueChange={(v: 'semesterFees' | 'hostelDues') => setAiInvoiceType(v)}>
            <SelectTrigger id="ai-invoice-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="semesterFees">Semester Fees</SelectItem>
              <SelectItem value="hostelDues">Hostel Dues</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {aiInvoiceType === 'semesterFees' && (
          <div>
            <Label htmlFor="ai-semester">Semester</Label>
            <Select value={aiSemester} onValueChange={setAiSemester}>
              <SelectTrigger id="ai-semester"><SelectValue placeholder="Select Semester" /></SelectTrigger>
              <SelectContent>{semesters.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
        
        <div>
            <Label htmlFor="ai-target-date">Target {aiInvoiceType === 'hostelDues' ? 'Month & Year' : 'Year'}</Label>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="ai-target-date"
                    variant={"outline"}
                    className={cn(
                    "w-full justify-start text-left font-normal",
                    !aiTargetDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {aiTargetDate ? (aiInvoiceType === 'hostelDues' ? format(aiTargetDate, "MMMM yyyy") : format(aiTargetDate, "yyyy")) : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={aiTargetDate}
                    onSelect={(date) => setAiTargetDate(date || new Date())}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
        </div>

      </div>
      <DialogModalFooter>
        <Button variant="outline" onClick={() => setIsAIGenerationOpen(false)} disabled={aiGenerating}>Cancel</Button>
        <Button onClick={handleAIGenerateInvoices} disabled={aiGenerating}>
          {aiGenerating ? 'Generating...' : 'Generate Invoices'}
        </Button>
      </DialogModalFooter>
    </DialogModal>
  );


  const renderInvoiceForm = () => (
    <DialogModal
        isOpen={isFormOpen}
        onClose={resetForm}
        title={editingInvoiceId ? 'Edit Invoice' : 'Create New Invoice'}
        description={editingInvoiceId ? `Update details for invoice ${editingInvoiceId}.` : 'Fill in the details for the new invoice.'}
    >
    <form onSubmit={handleFormSubmit}>
      <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="student-id">Student</Label>
            <Select value={currentInvoice?.studentId || ''} onValueChange={(value) => setCurrentInvoice({...currentInvoice, studentId: value})} required>
              <SelectTrigger id="student-id"><SelectValue placeholder="Select Student" /></SelectTrigger>
              <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="invoice-type">Invoice Type</Label>
            <Select value={currentInvoice?.type || ''} onValueChange={(value) => setCurrentInvoice({...currentInvoice, type: value as Invoice['type']})} required>
              <SelectTrigger id="invoice-type"><SelectValue placeholder="Select Type" /></SelectTrigger>
              <SelectContent>{invoiceTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="issue-date">Issue Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button id="issue-date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !currentInvoice?.issueDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentInvoice?.issueDate ? format(currentInvoice.issueDate, "PPP") : <span>Pick issue date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={currentInvoice?.issueDate} onSelect={(d) => setCurrentInvoice({...currentInvoice, issueDate: d})} initialFocus /></PopoverContent>
                </Popover>
            </div>
            <div>
                <Label htmlFor="due-date">Due Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button id="due-date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !currentInvoice?.dueDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentInvoice?.dueDate ? format(currentInvoice.dueDate, "PPP") : <span>Pick due date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={currentInvoice?.dueDate} onSelect={(d) => setCurrentInvoice({...currentInvoice, dueDate: d})} initialFocus /></PopoverContent>
                </Popover>
            </div>
        </div>
        
        <div className="space-y-2">
          <Label>Invoice Items</Label>
          {currentInvoice?.items?.map((item, index) => (
            <Card key={item.id} className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-end">
                <Input placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required />
                <Input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} className="w-20" min="1" required />
                <Input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))} className="w-28" step="0.01" min="0" required />
                <Input type="number" placeholder="Total" value={item.total} readOnly className="w-28 bg-muted/50" />
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={handleAddItem}><PlusCircle className="mr-2 h-4 w-4" />Add Item</Button>
        </div>

        <div>Total Amount: <span className="font-semibold">${currentInvoice?.items?.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2)}</span></div>

        <div>
            <Label htmlFor="invoice-status">Status</Label>
            <Select value={currentInvoice?.status || ''} onValueChange={(value) => setCurrentInvoice({...currentInvoice, status: value as Invoice['status']})} required>
                <SelectTrigger id="invoice-status"><SelectValue placeholder="Select Status" /></SelectTrigger>
                <SelectContent>{invoiceStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
            </Select>
        </div>
      </div>
      <DialogModalFooter>
          <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
          <Button type="submit">{editingInvoiceId ? 'Update Invoice' : 'Create Invoice'}</Button>
      </DialogModalFooter>
    </form>
    </DialogModal>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center"><FileText className="mr-3 h-8 w-8 text-primary" /> Invoice Management</h1>
        <div className="flex gap-2">
            <Button onClick={() => setIsAIGenerationOpen(true)}>
                <Bot className="mr-2 h-4 w-4" /> Generate with AI
            </Button>
            <Button onClick={() => { setCurrentInvoice({ items: [{ id: `item${Date.now()}`, description: '', quantity: 1, unitPrice: 0, total: 0 }] }); setEditingInvoiceId(null); setIsFormOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
        </div>
      </div>

      {renderAIGenerationForm()}
      {isFormOpen && renderInvoiceForm()}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Existing Invoices</CardTitle>
          <CardDescription>View, edit, or delete university invoices.</CardDescription>
          <div className="pt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by Invoice ID, Student Name/ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:w-auto"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {invoiceStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {invoiceTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {setSearchTerm(''); setFilterStatus(''); setFilterType('');}}><Filter className="mr-2 h-4 w-4"/>Clear</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? filteredInvoices.map(invoice => (
                <TableRow key={invoice.id} className={invoice.status === 'Overdue' ? 'bg-destructive/10 hover:bg-destructive/20' : ''}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.studentName} <span className="text-xs text-muted-foreground">({invoice.studentId})</span></TableCell>
                  <TableCell>{invoice.type}</TableCell>
                  <TableCell>{format(invoice.issueDate, "PP")}</TableCell>
                  <TableCell>{format(invoice.dueDate, "PP")}</TableCell>
                  <TableCell className="text-right">${invoice.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        invoice.status === 'Paid' && "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
                        invoice.status === 'Pending' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100",
                        invoice.status === 'Overdue' && "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100"
                    )}>{invoice.status}</span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(invoice)} className="hover:text-primary"><Edit3 className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete invoice {invoice.id}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(invoice.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={8} className="text-center h-24">No invoices found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


interface DialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function DialogModal({ isOpen, onClose, title, description, children, footer }: DialogModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                    {children}
                </CardContent>
                {footer && <CardFooter className="border-t pt-4">{footer}</CardFooter>}
            </Card>
        </div>
    );
}

function DialogModalFooter({children}: {children: React.ReactNode}) {
    return <div className="flex justify-end gap-2">{children}</div>
}

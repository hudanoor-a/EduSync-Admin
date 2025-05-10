"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateInvoiceDescriptions } from '@/ai/flows/generate-invoice-descriptions.js'; // .js extension
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
import { FileText, Edit3, Trash2, Search, Filter, PlusCircle, Bot, CalendarIcon, Eye } from 'lucide-react';
import { cn } from '@/lib/utils.js'; // .js extension


const initialInvoices = [
  { id: 'INV001', studentId: 'S001', studentName: 'Alice Johnson', issueDate: new Date(2024, 0, 15), dueDate: new Date(2024, 0, 30), items: [{id: 'item1', description: 'Semester Fees - Spring 2024', quantity: 1, unitPrice: 1200, total: 1200}], totalAmount: 1200, status: 'Paid', type: 'Semester Fees' },
  { id: 'INV002', studentId: 'S002', studentName: 'Bob Williams', issueDate: new Date(2024, 0, 20), dueDate: new Date(2024, 1, 5), items: [{id: 'item1', description: 'Hostel Dues - January 2024', quantity: 1, unitPrice: 300, total: 300}], totalAmount: 300, status: 'Pending', type: 'Hostel Dues' },
  { id: 'INV003', studentId: 'S001', studentName: 'Alice Johnson', issueDate: new Date(2024, 1, 1), dueDate: new Date(2024, 1, 15), items: [{id: 'item1', description: 'Hostel Dues - February 2024', quantity: 1, unitPrice: 300, total: 300}], totalAmount: 300, status: 'Overdue', type: 'Hostel Dues' },
];

const students = [
  { id: 'S001', name: 'Alice Johnson' },
  { id: 'S002', name: 'Bob Williams' },
  { id: 'S003', name: 'Charlie Brown' },
];

const invoiceTypes = ['Semester Fees', 'Hostel Dues', 'Exam Fees', 'Other'];
const invoiceStatuses = ['Pending', 'Paid', 'Overdue'];
const semesters = ["Spring", "Summer", "Fall", "Winter"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ALL_STATUSES_FILTER_VALUE = "_ALL_STATUSES_";
const ALL_TYPES_FILTER_VALUE = "_ALL_TYPES_";

export default function InvoiceManagementPage() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState(invoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(ALL_STATUSES_FILTER_VALUE);
  const [filterType, setFilterType] = useState(ALL_TYPES_FILTER_VALUE);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

  const [isAIGenerationOpen, setIsAIGenerationOpen] = useState(false);
  const [aiInvoiceType, setAiInvoiceType] = useState('semesterFees');
  const [aiTargetDate, setAiTargetDate] = useState(new Date());
  const [aiSemester, setAiSemester] = useState(semesters[0]);
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
    if (filterStatus && filterStatus !== ALL_STATUSES_FILTER_VALUE) {
      currentItems = currentItems.filter(inv => inv.status === filterStatus);
    }
    if (filterType && filterType !== ALL_TYPES_FILTER_VALUE) {
      currentItems = currentItems.filter(inv => inv.type === filterType);
    }
    setFilteredInvoices(currentItems.sort((a,b) => b.issueDate.getTime() - a.issueDate.getTime()));
  }, [invoices, searchTerm, filterStatus, filterType]);


  const handleFormSubmit = async (e) => {
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

    const invoiceData = {
      id: editingInvoiceId || `INV${Date.now()}`,
      studentId: currentInvoice.studentId,
      studentName: student.name,
      issueDate: currentInvoice.issueDate,
      dueDate: currentInvoice.dueDate,
      items: currentInvoice.items,
      totalAmount: totalAmount,
      status: currentInvoice.status,
      type: currentInvoice.type,
    };

    if (editingInvoiceId) {
      setInvoices(invoices.map(inv => inv.id === editingInvoiceId ? invoiceData : inv));
      toast({ title: "Invoice Updated", description: `Invoice ${invoiceData.id} has been updated.` });
    } else {
      setInvoices([...invoices, invoiceData]);
      toast({ title: "Invoice Created", description: `Invoice ${invoiceData.id} has been created.` });
    }
    resetForm();
  };

  const handleEdit = (invoice) => {
    setCurrentInvoice({ ...invoice, items: invoice.items.map(item => ({...item})) });
    setEditingInvoiceId(invoice.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (invoiceId) => {
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

  const handleItemChange = (index, field, value) => {
    setCurrentInvoice(prev => {
      if (!prev || !prev.items) return prev;
      const newItems = [...prev.items];
      const item = { ...newItems[index] };
      
      if (field === 'quantity' || field === 'unitPrice') {
        item[field] = parseFloat(value) || 0; // Ensure numeric for calculation
      } else {
        item[field] = value;
      }

      if (field === 'quantity' || field === 'unitPrice') {
        item.total = (item.quantity || 0) * (item.unitPrice || 0);
      }
      newItems[index] = item;
      return { ...prev, items: newItems };
    });
  };
  
  const handleRemoveItem = (index) => {
    setCurrentInvoice(prev => ({
      ...prev,
      items: prev?.items?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAIGenerateInvoices = async () => {
    setAiGenerating(true);
    const year = getYear(aiTargetDate).toString();
    let month = undefined;
    let semesterInput = undefined;

    if (aiInvoiceType === 'hostelDues') {
      month = months[getMonth(aiTargetDate)];
    } else {
      semesterInput = aiSemester;
    }

    const input = {
      invoiceType: aiInvoiceType,
      semester: semesterInput,
      month: month,
      year: year,
    };

    try {
      const result = await generateInvoiceDescriptions(input);
      const description = result.description;
      
      const newAiInvoices = students.map(student => ({
        id: `AI_INV${Date.now()}_${student.id}`,
        studentId: student.id,
        studentName: student.name,
        issueDate: aiTargetDate,
        dueDate: new Date(new Date(aiTargetDate).setDate(aiTargetDate.getDate() + 15)), 
        items: [{
          id: 'ai_item1',
          description: description,
          quantity: 1,
          unitPrice: aiInvoiceType === 'semesterFees' ? 1500 : 350, 
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
          <Select value={aiInvoiceType} onValueChange={(v) => setAiInvoiceType(v || 'semesterFees')}>
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
            <Select value={aiSemester} onValueChange={(v) => setAiSemester(v || semesters[0])}>
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
        <Button variant="outline" onClick={() => setIsAIGenerationOpen(false)} disabled={aiGenerating} className="w-full sm:w-auto">Cancel</Button>
        <Button onClick={handleAIGenerateInvoices} disabled={aiGenerating} className="w-full sm:w-auto">
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
      <div className="space-y-4 py-4 max-h-[70vh] sm:max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="student-id">Student</Label>
            <Select value={currentInvoice?.studentId || ''} onValueChange={(value) => setCurrentInvoice({...currentInvoice, studentId: value})} >
              <SelectTrigger id="student-id"><SelectValue placeholder="Select Student" /></SelectTrigger>
              <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="invoice-type">Invoice Type</Label>
            <Select value={currentInvoice?.type || ''} onValueChange={(value) => setCurrentInvoice({...currentInvoice, type: value})} >
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
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={currentInvoice?.issueDate} onSelect={(d) => setCurrentInvoice({...currentInvoice, issueDate: d || undefined})} initialFocus /></PopoverContent>
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
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={currentInvoice?.dueDate} onSelect={(d) => setCurrentInvoice({...currentInvoice, dueDate: d || undefined})} initialFocus /></PopoverContent>
                </Popover>
            </div>
        </div>
        
        <div className="space-y-2">
          <Label>Invoice Items</Label>
          {currentInvoice?.items?.map((item, index) => (
            <Card key={item.id} className="p-3">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_100px_auto] gap-2 items-end">
                <Input placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required className="sm:col-span-1"/>
                <Input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full sm:w-20" min="1" required />
                <Input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full sm:w-28" step="0.01" min="0" required />
                <Input type="number" placeholder="Total" value={item.total.toFixed(2)} readOnly className="w-full sm:w-28 bg-muted/50" />
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="text-destructive place-self-end sm:place-self-center"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="w-full sm:w-auto"><PlusCircle className="mr-2 h-4 w-4" />Add Item</Button>
        </div>

        <div>Total Amount: <span className="font-semibold">${currentInvoice?.items?.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2)}</span></div>

        <div>
            <Label htmlFor="invoice-status">Status</Label>
            <Select value={currentInvoice?.status || ''} onValueChange={(value) => setCurrentInvoice({...currentInvoice, status: value})} >
                <SelectTrigger id="invoice-status"><SelectValue placeholder="Select Status" /></SelectTrigger>
                <SelectContent>{invoiceStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
            </Select>
        </div>
      </div>
      <DialogModalFooter>
          <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto">Cancel</Button>
          <Button type="submit" className="w-full sm:w-auto">{editingInvoiceId ? 'Update Invoice' : 'Create Invoice'}</Button>
      </DialogModalFooter>
    </form>
    </DialogModal>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center"><FileText className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" /> Invoice Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={() => setIsAIGenerationOpen(true)} className="w-full sm:w-auto">
                <Bot className="mr-2 h-4 w-4" /> Generate with AI
            </Button>
            <Button onClick={() => { setCurrentInvoice({ items: [{ id: `item${Date.now()}`, description: '', quantity: 1, unitPrice: 0, total: 0 }], issueDate: new Date(), dueDate: new Date(new Date().setDate(new Date().getDate() + 15)) }); setEditingInvoiceId(null); setIsFormOpen(true); }} className="w-full sm:w-auto">
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
          <div className="pt-4 flex flex-col sm:flex-row gap-2 items-center">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES_FILTER_VALUE}>All Statuses</SelectItem>
                {invoiceStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TYPES_FILTER_VALUE}>All Types</SelectItem>
                {invoiceTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {setSearchTerm(''); setFilterStatus(ALL_STATUSES_FILTER_VALUE); setFilterType(ALL_TYPES_FILTER_VALUE);}} className="w-full sm:w-auto"><Filter className="mr-2 h-4 w-4"/>Clear</Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden lg:table-cell">Issue Date</TableHead>
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
                  <TableCell>{invoice.studentName} <span className="text-xs text-muted-foreground hidden sm:inline">({invoice.studentId})</span></TableCell>
                  <TableCell className="hidden md:table-cell">{invoice.type}</TableCell>
                  <TableCell className="hidden lg:table-cell">{format(invoice.issueDate, "PP")}</TableCell>
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
                  <TableCell className="text-right space-x-1">
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


function DialogModal({ isOpen, onClose, title, description, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-sm">
            <Card className="w-full max-w-xs sm:max-w-md md:max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 pt-0">
                    {children}
                </CardContent>
                {/* Footer is now part of renderInvoiceForm/renderAIGenerationForm for specific button layouts */}
            </Card>
        </div>
    );
}

function DialogModalFooter({children}) {
    return <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-end gap-2">{children}</CardFooter>
}
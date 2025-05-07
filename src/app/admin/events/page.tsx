"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, PlusCircle, Edit3, Trash2, UploadCloud, ListFilter, Download, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseExcelFile, type ExcelData } from '@/services/excel';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  category: string; // e.g., Academic, Cultural, Sports
}

const initialEvents: Event[] = [
  { id: 'EVT001', title: 'Annual Tech Fest', description: 'A week-long festival of technology and innovation.', date: new Date(2024, 7, 15), location: 'Main Auditorium', category: 'Academic' },
  { id: 'EVT002', title: 'Inter-University Debate', description: 'Debate competition with participants from various universities.', date: new Date(2024, 8, 5), location: 'Conference Hall A', category: 'Academic' },
  { id: 'EVT003', title: 'Cultural Night 2024', description: 'An evening showcasing diverse cultural performances.', date: new Date(2024, 9, 20), location: 'Open Air Theatre', category: 'Cultural' },
];

const eventCategories = ["Academic", "Cultural", "Sports", "Workshop", "Seminar", "Guest Lecture", "Festival", "Other"];
const ALL_CATEGORIES_FILTER_VALUE = "_ALL_CATEGORIES_";

export default function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event> | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    let currentEvents = events;
    if (searchTerm) {
      currentEvents = currentEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterCategory && filterCategory !== ALL_CATEGORIES_FILTER_VALUE) {
      currentEvents = currentEvents.filter(event => event.category === filterCategory);
    }
    setFilteredEvents(currentEvents);
  }, [events, searchTerm, filterCategory]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentEvent || !currentEvent.title || !currentEvent.date || !currentEvent.location || !currentEvent.category) {
      toast({ title: "Missing Fields", description: "Please fill all required event details.", variant: "destructive" });
      return;
    }

    const eventData: Event = {
      id: editingEventId || `EVT${Date.now()}`,
      title: currentEvent.title,
      description: currentEvent.description || '',
      date: currentEvent.date,
      location: currentEvent.location,
      category: currentEvent.category,
    };

    if (editingEventId) {
      // Simulate API call: await fetch(`/api/events/update/${editingEventId}`, { method: 'PUT', body: JSON.stringify(eventData) });
      setEvents(events.map(ev => ev.id === editingEventId ? eventData : ev));
      toast({ title: "Event Updated", description: `"${eventData.title}" has been updated.` });
    } else {
      // Simulate API call: await fetch('/api/events/create', { method: 'POST', body: JSON.stringify(eventData) });
      setEvents([...events, eventData]);
      toast({ title: "Event Created", description: `"${eventData.title}" has been added.` });
    }
    resetForm();
  };

  const handleEdit = (event: Event) => {
    setCurrentEvent({ ...event });
    setEditingEventId(event.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    // Simulate API call: await fetch(`/api/events/delete/${eventId}`, { method: 'DELETE' });
    setEvents(events.filter(ev => ev.id !== eventId));
    toast({ title: "Event Deleted", description: "The event has been removed." });
  };
  
  const resetForm = () => {
    setCurrentEvent(null);
    setEditingEventId(null);
    setIsFormOpen(false);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select an Excel file to upload.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const parsedData: ExcelData[] = await parseExcelFile(file); // This would be backend in real app
      const newEvents: Event[] = parsedData.map((row, index) => ({
        id: row.id?.toString() || `EVT_F${Date.now() + index}`,
        title: row.title?.toString() || 'Untitled Event',
        description: row.description?.toString() || '',
        date: row.date ? new Date(row.date.toString()) : new Date(),
        location: row.location?.toString() || 'N/A',
        category: row.category?.toString() || 'Other',
      }));

      // Simulate API call: await fetch('/api/events/create-bulk', { method: 'POST', body: JSON.stringify(newEvents) });
      setEvents(prev => [...prev, ...newEvents]);
      toast({ title: "Upload Successful", description: `${newEvents.length} events added from ${file.name}.` });
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Upload Failed", description: "Could not process the file.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const renderEventForm = () => (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>{editingEventId ? 'Edit Event' : 'Create New Event'}</CardTitle>
        <CardDescription>{editingEventId ? 'Update the details of the existing event.' : 'Fill in the details for the new event.'}</CardDescription>
      </CardHeader>
      <form onSubmit={handleFormSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="event-title">Event Title</Label>
            <Input id="event-title" placeholder="e.g., Annual Science Fair" value={currentEvent?.title || ''} onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})} required />
          </div>
          <div>
            <Label htmlFor="event-description">Description</Label>
            <Textarea id="event-description" placeholder="Detailed information about the event." value={currentEvent?.description || ''} onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !currentEvent?.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {currentEvent?.date ? format(currentEvent.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={currentEvent?.date}
                    onSelect={(date) => setCurrentEvent({...currentEvent, date: date || undefined })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="event-location">Location</Label>
              <Input id="event-location" placeholder="e.g., University Auditorium" value={currentEvent?.location || ''} onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})} required />
            </div>
          </div>
          <div>
            <Label htmlFor="event-category">Category</Label>
             <Select value={currentEvent?.category || ''} onValueChange={(value) => setCurrentEvent({...currentEvent, category: value})} required>
                <SelectTrigger id="event-category"><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                    {eventCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
          <Button type="submit">{editingEventId ? 'Update Event' : 'Create Event'}</Button>
        </CardFooter>
      </form>
    </Card>
  );

  const renderFileUpload = () => (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>Upload Events via Excel</CardTitle>
        <CardDescription>
            Upload an Excel file (.xlsx, .xls, .csv) with event data. Ensure columns: id (optional), title, description, date (YYYY-MM-DD), location, category.
            <Button variant="link" size="sm" className="p-0 h-auto ml-2" asChild>
                <a href="/templates/event_template.xlsx" download data-ai-hint="download template">Download Template <Download className="ml-1 h-3 w-3"/></a>
            </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <Label htmlFor="event-file-upload" className="block mb-2 text-sm font-medium">Choose Excel File</Label>
            <Input 
            id="event-file-upload" 
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
          {uploading ? 'Uploading...' : 'Upload Events'}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center"><CalendarDays className="mr-3 h-8 w-8 text-primary" /> Event Management</h1>
      </div>

      <Tabs defaultValue="manual">
        <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual" onClick={() => setIsFormOpen(false)}>Manual Management</TabsTrigger>
            <TabsTrigger value="upload">Upload Events File</TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
            {!isFormOpen && (
                <div className="flex justify-end mb-4">
                    <Button onClick={() => { setCurrentEvent({}); setEditingEventId(null); setIsFormOpen(true); }}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
                    </Button>
                </div>
            )}
            {isFormOpen ? renderEventForm() : (
                <Card className="shadow-lg">
                    <CardHeader>
                    <CardTitle>Existing Events</CardTitle>
                    <CardDescription>View, edit, or delete university events.</CardDescription>
                    <div className="pt-4 flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 sm:w-auto"
                        />
                        </div>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL_CATEGORIES_FILTER_VALUE}>All Categories</SelectItem>
                                {eventCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => {setSearchTerm(''); setFilterCategory('');}}><ListFilter className="mr-2 h-4 w-4"/>Clear Filters</Button>
                    </div>
                    </CardHeader>
                    <CardContent>
                    {filteredEvents.length > 0 ? (
                        <div className="space-y-4">
                        {filteredEvents.map(event => (
                            <Card key={event.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{event.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{format(event.date, "PPP")} - {event.location}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => handleEdit(event)}><Edit3 className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the event "{event.title}".
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(event.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{event.description}</p>
                                <p className="text-xs mt-2 text-muted-foreground">Category: {event.category}</p>
                            </CardContent>
                            </Card>
                        ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No events found matching your criteria. {isFormOpen ? '' : 'Click "Add New Event" to create one.'}</p>
                    )}
                    </CardContent>
                </Card>
            )}
        </TabsContent>
        <TabsContent value="upload">
          {renderFileUpload()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
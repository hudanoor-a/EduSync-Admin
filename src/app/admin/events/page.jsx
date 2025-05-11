
"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, PlusCircle, Edit3, Trash2, UploadCloud, ListFilter, Download, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';
// @ts-ignore
import { parseExcelFile } from '@/services/excel.js';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils.js";
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


const initialEvents = [
  { id: 'EVT001', title: 'Annual Tech Fest', description: 'A week-long festival of technology and innovation.', date: new Date(2024, 7, 15), location: 'Main Auditorium', category: 'Academic' },
  { id: 'EVT002', title: 'Inter-University Debate', description: 'Debate competition with participants from various universities.', date: new Date(2024, 8, 5), location: 'Conference Hall A', category: 'Academic' },
  { id: 'EVT003', title: 'Cultural Night 2024', description: 'An evening showcasing diverse cultural performances.', date: new Date(2024, 9, 20), location: 'Open Air Theatre', category: 'Cultural' },
];

const eventCategories = ["Academic", "Cultural", "Sports", "Workshop", "Seminar", "Guest Lecture", "Festival", "Other"].filter(c => c !== "");
const ALL_CATEGORIES_FILTER_VALUE = "_ALL_CATEGORIES_";

export default function EventManagementPage() {
  const [events, setEvents] = useState(initialEvents);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState(ALL_CATEGORIES_FILTER_VALUE);
  
  const [currentEvent, setCurrentEvent] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [activeTab, setActiveTab] = useState("view");

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    let currentEvents = events;
    if (searchTerm) {
      currentEvents = currentEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterCategory && filterCategory !== ALL_CATEGORIES_FILTER_VALUE) {
      currentEvents = currentEvents.filter(event => event.category === filterCategory);
    }
    setFilteredEvents(currentEvents.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [events, searchTerm, filterCategory]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!currentEvent || !currentEvent.title || !currentEvent.date || !currentEvent.location || !currentEvent.category) {
      toast({ title: "Missing Fields", description: "Please fill all required event details.", variant: "destructive" });
      return;
    }

    const eventData = {
      id: editingEventId || `EVT${Date.now()}`,
      title: currentEvent.title,
      description: currentEvent.description || '',
      date: currentEvent.date, 
      location: currentEvent.location,
      category: currentEvent.category,
    };

    if (editingEventId) {
      setEvents(events.map(ev => ev.id === editingEventId ? eventData : ev));
      toast({ title: "Event Updated", description: `"${eventData.title}" has been updated.` });
    } else {
      setEvents([...events, eventData]);
      toast({ title: "Event Created", description: `"${eventData.title}" has been added.` });
    }
    resetForm();
    setActiveTab("view");
  };

  const handleEdit = (event) => {
    setCurrentEvent({ ...event, date: new Date(event.date) }); 
    setEditingEventId(event.id);
    setActiveTab("add"); 
  };

  const handleDelete = async (eventId) => {
    const eventToDelete = events.find(e => e.id === eventId);
    setEvents(events.filter(ev => ev.id !== eventId));
    toast({ title: "Event Deleted", description: `Event "${eventToDelete?.title}" has been removed.` });
  };
  
  const resetForm = () => {
    setCurrentEvent(null);
    setEditingEventId(null);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select an Excel file to upload.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const parsedData = await parseExcelFile(file); 
      const newEvents = parsedData.map((row, index) => ({
        id: row.id?.toString() || `EVT_F${Date.now() + index}`,
        title: row.title?.toString() || 'Untitled Event',
        description: row.description?.toString() || '',
        date: row.date ? new Date(row.date.toString()) : new Date(), 
        location: row.location?.toString() || 'N/A',
        category: row.category?.toString() || (eventCategories.length > 0 ? eventCategories[0] : 'Other'),
      })).filter(ne => !events.some(ee => ee.id === ne.id)); 

      const skippedCount = parsedData.length - newEvents.length;

      setEvents(prev => [...prev, ...newEvents]);
      toast({ title: "Upload Successful", description: `${newEvents.length} events added. ${skippedCount > 0 ? `${skippedCount} events skipped due to duplicate ID.` : ''}` });
      setFile(null);
      setActiveTab("view");
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Upload Failed", description: "Could not process the file. Check format.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const renderEventForm = () => (
    <
// @ts-ignore
    Card className="mt-6 shadow-lg">
      <
// @ts-ignore
      CardHeader>
        <
// @ts-ignore
        CardTitle>{editingEventId ? 'Edit Event' : 'Create New Event'}</CardTitle>
        <
// @ts-ignore
        CardDescription>{editingEventId ? 'Update the details of the existing event.' : 'Fill in the details for the new event.'}</CardDescription>
      </CardHeader>
      <form onSubmit={handleFormSubmit}>
        <
// @ts-ignore
        CardContent className="space-y-4">
          <div>
            <
// @ts-ignore
            Label htmlFor="event-title">Event Title</Label>
            <Input 
// @ts-ignore
            id="event-title" placeholder="e.g., Annual Science Fair" value={currentEvent?.title || ''} onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})} required />
          </div>
          <div>
            <
// @ts-ignore
            Label htmlFor="event-description">Description</Label>
            <Textarea 
// @ts-ignore
            id="event-description" placeholder="Detailed information about the event." value={currentEvent?.description || ''} onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <
// @ts-ignore
              Label htmlFor="event-date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <
// @ts-ignore
                  Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !currentEvent?.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {currentEvent?.date ? format(new Date(currentEvent.date), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <
// @ts-ignore
                PopoverContent className="w-auto p-0">
                  <
// @ts-ignore
                  Calendar
                    mode="single"
                    selected={currentEvent?.date ? new Date(currentEvent.date) : undefined} 
                    onSelect={(date) => setCurrentEvent({...currentEvent, date: date || undefined })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <
// @ts-ignore
              Label htmlFor="event-location">Location</Label>
              <Input 
// @ts-ignore
              id="event-location" placeholder="e.g., University Auditorium" value={currentEvent?.location || ''} onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})} required />
            </div>
          </div>
          <div>
            <
// @ts-ignore
            Label htmlFor="event-category">Category</Label>
             <Select value={currentEvent?.category || ''} onValueChange={(value) => setCurrentEvent({...currentEvent, category: value})} >
                <
// @ts-ignore
                SelectTrigger id="event-category"><SelectValue placeholder="Select Category" /></SelectTrigger>
                <
// @ts-ignore
                SelectContent>
                    {eventCategories.map(cat => <
// @ts-ignore
                    SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        </CardContent>
        <
// @ts-ignore
        CardFooter className="flex flex-col sm:flex-row justify-end gap-2">
          <
// @ts-ignore
          Button type="button" variant="outline" onClick={() => { resetForm(); setActiveTab("view");}} className="w-full sm:w-auto">Cancel</Button>
          <
// @ts-ignore
          Button type="submit" className="w-full sm:w-auto">{editingEventId ? 'Update Event' : 'Create Event'}</Button>
        </CardFooter>
      </form>
    </Card>
  );

  const renderFileUpload = () => (
    <
// @ts-ignore
    Card className="mt-6 shadow-lg">
      <
// @ts-ignore
      CardHeader>
        <
// @ts-ignore
        CardTitle>Upload Events via Excel</CardTitle>
        <
// @ts-ignore
        CardDescription>
            Upload an Excel file (.xlsx, .xls, .csv) with event data. Columns: id (optional), title, description, date (YYYY-MM-DD), location, category.
            <
// @ts-ignore
            Button variant="link" size="sm" className="p-0 h-auto ml-1 sm:ml-2 align-baseline" asChild>
                <a href="/templates/event_template.xlsx" download data-ai-hint="download template">Download Template <Download className="ml-1 h-3 w-3"/></a>
            </Button>
        </CardDescription>
      </CardHeader>
      <
// @ts-ignore
      CardContent className="space-y-4">
        <div className="space-y-2">
            <
// @ts-ignore
            Label htmlFor="event-file-upload" className="block text-sm font-medium">Choose Excel File</Label>
            <Input 
            // @ts-ignore
            id="event-file-upload" 
            type="file" 
            accept=".xlsx, .xls, .csv"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {file && <p className="text-sm text-muted-foreground mt-1">Selected: {file.name}</p>}
        </div>
      </CardContent>
      <
// @ts-ignore
      CardFooter className="mt-2"> 
        <
// @ts-ignore
        Button onClick={handleFileUpload} disabled={uploading || !file} className="w-full md:w-auto">
          <UploadCloud className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Events'}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center"><CalendarDays className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" /> Event Management</h1>
      </div>

      <Tabs
  value={activeTab}
  onValueChange={(value) => {
    setActiveTab(value);
    if (value !== "add") {
      resetForm();
    } else if (!editingEventId && value === "add") {
      setCurrentEvent({ date: new Date() });
    }
  }}
  className="w-full space-y-4"
>
  <
// @ts-ignore
  TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-12 gap-4">
    <
// @ts-ignore
    TabsTrigger
      value="view"
      className="w-full sm:min-w-[150px] px-4 py-2"
    >
      View Events
    </TabsTrigger>
    <
// @ts-ignore
    TabsTrigger
      value="add"
      className="w-full sm:min-w-[150px] px-4 py-2"
    >
      Add/Edit Manually
    </TabsTrigger>
    <
// @ts-ignore
    TabsTrigger
      value="upload"
      className="w-full sm:min-w-[150px] px-4 py-2"
    >
      Upload Excel
    </TabsTrigger>
  </TabsList>

  <
// @ts-ignore
  TabsContent value="view" className="pt-6 pb-4 mt-6">
    {/* Added mt-6 here for space below tabs */}
    <div className="flex justify-end mb-4"></div>
    <
// @ts-ignore
    Card className="shadow-lg">
      <
// @ts-ignore
      CardHeader>
        <
// @ts-ignore
        CardTitle>Existing Events</CardTitle>
        <
// @ts-ignore
        CardDescription>
          View, edit, or delete university events.
        </CardDescription>
        <
// @ts-ignore
        Button
          onClick={() => {
            setCurrentEvent({ date: new Date() });
            setEditingEventId(null);
            setActiveTab("add");
          }}
          className="w-auto sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
        </Button>
        <div className="pt-4 flex flex-col sm:flex-row gap-2 items-center flex-wrap">
          <div className="relative flex-grow w-full sm:w-auto min-w-[150px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              // @ts-ignore
              type="search"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <Select
            value={filterCategory}
            onValueChange={setFilterCategory}
          >
            <
// @ts-ignore
            SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <
// @ts-ignore
            SelectContent>
              <
// @ts-ignore
              SelectItem value={ALL_CATEGORIES_FILTER_VALUE}>
                All Categories
              </SelectItem>
              {eventCategories.map((cat) => (
                <
// @ts-ignore
                SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <
// @ts-ignore
          Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setFilterCategory(ALL_CATEGORIES_FILTER_VALUE);
            }}
            className="w-full sm:w-auto"
          >
            <ListFilter className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </CardHeader>
      <
// @ts-ignore
      CardContent>
        {filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <
// @ts-ignore
              Card
                key={event.id}
                className="hover:shadow-md transition-shadow"
              >
                <
// @ts-ignore
                CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex-grow">
                      <
// @ts-ignore
                      CardTitle className="text-lg">
                        {event.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.date), "PPP")} -{" "}
                        {event.location}
                      </p>
                    </div>
                    <div className="flex gap-2 self-start sm:self-center mt-2 sm:mt-0">

                      {/* here */}
                      <
// @ts-ignore
                      Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(event)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <
// @ts-ignore
                          Button
                            variant="destructive"
                            size="icon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <
// @ts-ignore
                        AlertDialogContent>
                          <
// @ts-ignore
                          AlertDialogHeader>
                            <
// @ts-ignore
                            AlertDialogTitle>
                              Are you sure?
                            </AlertDialogTitle>
                            <
// @ts-ignore
                            AlertDialogDescription>
                              This action cannot be undone. This
                              will permanently delete the event "
                              {event.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <
// @ts-ignore
                          AlertDialogFooter>
                            <
// @ts-ignore
                            AlertDialogCancel>
                              Cancel
                            </AlertDialogCancel>
                            <
// @ts-ignore
                            AlertDialogAction
                              onClick={() => handleDelete(event.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <
// @ts-ignore
                CardContent>
                  <p className="text-sm">{event.description}</p>
                  <p className="text-xs mt-2 text-muted-foreground">
                    Category: {event.category}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No events found matching your criteria.
          </p>
        )}
      </CardContent>
    </Card>
  </TabsContent>
  <
// @ts-ignore
  TabsContent value="add" className="pt-6 pb-4">
    {currentEvent || editingEventId ? (
      renderEventForm()
    ) : (
      <p className="text-muted-foreground text-center py-4">
        Select "Add/Edit Manually" tab and click "Add New Event" button or an
        "Edit" button on an event to open the form.
      </p>
    )}
    {activeTab === "add" && !editingEventId && !currentEvent && (
      <div className="text-center mt-4">
        <
// @ts-ignore
        Button
          onClick={() => setCurrentEvent({ date: new Date() })}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Event Manually
        </Button>
      </div>
    )}
  </TabsContent>
  <
// @ts-ignore
  TabsContent value="upload" className="pt-6 pb-4">
    {renderFileUpload()}
  </TabsContent>
</Tabs>





    </div>
  );
}

    
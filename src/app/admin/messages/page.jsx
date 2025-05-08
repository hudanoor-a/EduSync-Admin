
"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Users, User, CornerDownLeft, List, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge'; // Import Badge
import { format } from 'date-fns'; // Import format


const mockStudents = [
  { id: 'S001', name: 'Alice Johnson', type: 'student' },
  { id: 'S002', name: 'Bob Williams', type: 'student' },
  { id: 'S003', name: 'Charlie Brown', type: 'student' },
];
const mockFaculty = [
  { id: 'F001', name: 'Dr. Eleanor Vance', type: 'faculty' },
  { id: 'F002', name: 'Prof. Samuel Green', type: 'faculty' },
];
const predefinedGroups = [
    { id: 'group_all_students', name: 'All Students', type: 'group'},
    { id: 'group_all_faculty', name: 'All Faculty', type: 'group'},
    { id: 'group_cs_2023', name: 'Computer Science - Batch 2023', type: 'group'},
];

// Minimal XCircle icon if not available in lucide-react or for custom styling needs.
const XCircle = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);


export default function MessagesPage() {
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableRecipients, setAvailableRecipients] = useState([...predefinedGroups, ...mockStudents, ...mockFaculty]);
  
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (selectedRecipients.length === 0 || !subject.trim() || !body.trim()) {
      toast({ title: "Missing Information", description: "Please select recipients and fill in subject and message body.", variant: "destructive" });
      return;
    }

    const newMessage = {
      id: `MSG${Date.now()}`,
      recipients: selectedRecipients,
      subject,
      body,
      sentAt: new Date(),
      sender: 'Admin',
    };

    // Simulate API call: await fetch('/api/messages/send', { method: 'POST', body: JSON.stringify(newMessage) });
    setSentMessages(prev => [newMessage, ...prev]);
    toast({ title: "Message Sent", description: `Message "${subject}" sent to ${selectedRecipients.length} recipient(s).` });
    
    // Reset form
    setSelectedRecipients([]);
    setSubject('');
    setBody('');
  };
  
  const handleRecipientSelect = (recipient) => {
    setSelectedRecipients(prev => 
      prev.find(r => r.id === recipient.id) 
        ? prev.filter(r => r.id !== recipient.id)
        : [...prev, recipient]
    );
  };

  const filteredAvailableRecipients = availableRecipients.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center"><MessageSquare className="mr-3 h-8 w-8 text-primary" /> Send Messages</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Compose New Message</CardTitle>
            <CardDescription>Send a message to students, faculty, or groups.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <Label htmlFor="recipients">Recipients</Label>
                <div className="p-2 border rounded-md min-h-[40px] flex flex-wrap gap-1">
                    {selectedRecipients.length > 0 ? selectedRecipients.map(r => (
                        <Badge key={r.id} variant="secondary" className="flex items-center gap-1">
                            {r.name}
                            <button type="button" onClick={() => handleRecipientSelect(r)} className="ml-1 text-muted-foreground hover:text-foreground">
                                <XCircle className="h-3 w-3"/>
                            </button>
                        </Badge>
                    )) : <span className="text-sm text-muted-foreground">Select recipients from the list</span>}
                </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g., Important Announcement" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="body">Message Body</Label>
              <Textarea id="body" placeholder="Type your message here..." value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSendMessage} className="w-full sm:w-auto">
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Select Recipients</CardTitle>
                <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        type="search"
                        placeholder="Search recipients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-full"
                    />
                </div>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto space-y-2">
                {filteredAvailableRecipients.length > 0 ? filteredAvailableRecipients.map(recipient => (
                     <div key={recipient.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer" onClick={() => handleRecipientSelect(recipient)}>
                        <Checkbox 
                            id={`recipient-${recipient.id}`}
                            checked={selectedRecipients.some(r => r.id === recipient.id)}
                            onCheckedChange={() => handleRecipientSelect(recipient)}
                        />
                        <Label htmlFor={`recipient-${recipient.id}`} className="flex-grow cursor-pointer">
                            {recipient.name}
                            <span className="text-xs text-muted-foreground ml-1">({recipient.type})</span>
                        </Label>
                    </div>
                )) : <p className="text-sm text-muted-foreground text-center">No recipients found.</p>}
            </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Sent Messages Log</CardTitle>
          <CardDescription>History of messages sent by the admin.</CardDescription>
        </CardHeader>
        <CardContent>
          {sentMessages.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {sentMessages.map(msg => (
                <details key={msg.id} className="border rounded-md p-3 hover:bg-muted/30">
                  <summary className="cursor-pointer font-medium flex justify-between items-center">
                    <span>{msg.subject} - To: {msg.recipients.length} recipient(s)</span>
                    <span className="text-xs text-muted-foreground">{format(msg.sentAt, "PPp")}</span>
                  </summary>
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                    <p className="text-xs text-muted-foreground mt-2">Recipients: {msg.recipients.map(r => r.name).join(', ')}</p>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No messages sent yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

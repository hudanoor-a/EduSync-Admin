"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Filter, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js'; // .js extension
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
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';


const initialLeaveRequests = [
  { id: 'LR001', facultyName: 'Dr. Eleanor Vance', facultyId: 'F001', department: 'Physics', startDate: new Date(2024, 7, 20), endDate: new Date(2024, 7, 22), reason: 'Personal emergency', status: 'Pending', requestedAt: new Date(2024, 7, 10, 9, 0) },
  { id: 'LR002', facultyName: 'Prof. Samuel Green', facultyId: 'F002', department: 'Mathematics', startDate: new Date(2024, 8, 1), endDate: new Date(2024, 8, 5), reason: 'Attending a conference', status: 'Approved', requestedAt: new Date(2024, 7, 5, 14, 30) },
  { id: 'LR003', facultyName: 'Dr. Olivia Chen', facultyId: 'F003', department: 'Computer Science', startDate: new Date(2024, 7, 25), endDate: new Date(2024, 7, 25), reason: 'Doctor\'s appointment', status: 'Pending', requestedAt: new Date(2024, 7, 12, 11, 15) },
  { id: 'LR004', facultyName: 'Dr. Eleanor Vance', facultyId: 'F001', department: 'Physics', startDate: new Date(2024, 9, 10), endDate: new Date(2024, 9, 12), reason: 'Family vacation', status: 'Rejected', requestedAt: new Date(2024, 7, 1, 16, 0) },
];

const departments = ["Physics", "Mathematics", "Computer Science"];
const ALL_DEPARTMENTS_FILTER_VALUE = "_ALL_DEPARTMENTS_";
const ALL_STATUSES_FILTER_VALUE = "_ALL_STATUSES_";


export default function LeaveRequestsPage() {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [filteredRequests, setFilteredRequests] = useState(leaveRequests);
  const [filterStatus, setFilterStatus] = useState(ALL_STATUSES_FILTER_VALUE);
  const [filterDepartment, setFilterDepartment] = useState(ALL_DEPARTMENTS_FILTER_VALUE);

  const { toast } = useToast();

  useEffect(() => {
    let currentItems = leaveRequests;
    if (filterStatus !== ALL_STATUSES_FILTER_VALUE) {
      currentItems = currentItems.filter(req => req.status === filterStatus);
    }
    if (filterDepartment !== ALL_DEPARTMENTS_FILTER_VALUE) {
      currentItems = currentItems.filter(req => req.department === filterDepartment);
    }
    setFilteredRequests(currentItems.sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        if (a.status === 'Pending' && b.status === 'Pending') {
            return b.requestedAt.getTime() - a.requestedAt.getTime();
        }
        return a.startDate.getTime() - b.startDate.getTime();
    }));

  }, [leaveRequests, filterStatus, filterDepartment]);

  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    setLeaveRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
    toast({
      title: `Leave Request ${newStatus}`,
      description: `Request ID ${requestId} has been ${newStatus.toLowerCase()}.`,
      variant: newStatus === 'Approved' ? 'default' : 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center"><Clock className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" /> Faculty Leave Requests</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5"/> Filters</CardTitle>
          <CardDescription>Filter leave requests by status and department.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value || ALL_STATUSES_FILTER_VALUE)}>
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES_FILTER_VALUE}>All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="department-filter">Department</Label>
            <Select value={filterDepartment} onValueChange={(value) => setFilterDepartment(value || ALL_DEPARTMENTS_FILTER_VALUE)}>
              <SelectTrigger id="department-filter" className="w-full">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value={ALL_DEPARTMENTS_FILTER_VALUE}>All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredRequests.map(request => (
            <Card key={request.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{request.facultyName}</CardTitle>
                        <CardDescription>{request.department} - ID: {request.facultyId}</CardDescription>
                    </div>
                    <Badge variant={
                        request.status === 'Approved' ? 'default' :
                        request.status === 'Rejected' ? 'destructive' :
                        'secondary' 
                    }>
                        {request.status}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 flex-grow">
                <p className="text-sm"><strong>Dates:</strong> {format(request.startDate, "PP")} - {format(request.endDate, "PP")}</p>
                <p className="text-sm"><strong>Reason:</strong> {request.reason}</p>
                <p className="text-xs text-muted-foreground">Requested on: {format(request.requestedAt, "PPp")}</p>
              </CardContent>
              {request.status === 'Pending' && (
                <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-auto">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject this leave request for {request.facultyName}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleUpdateRequestStatus(request.id, 'Rejected')}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Confirm Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to approve this leave request for {request.facultyName}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => handleUpdateRequestStatus(request.id, 'Approved')}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Confirm Approve
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">No leave requests match the current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
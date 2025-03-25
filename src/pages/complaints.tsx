import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Calendar, ArrowLeft, MapPin, Clock, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Supabase client initialization
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Updated Complaint interface
interface Complaint {
  id: number;
  user_phone: string;
  category: string;
  subcategory?: string;
  address: string;
  description: string;
  status: string;
  created_at: string;
  updated_at?: string;
  field_worker_assigned?: string;
  deadline_date?: string;
}

// Field Worker interface
interface FieldWorker {
  id: number;
  name: string;
  phone_number: string;
  master_category: string;
  work_status: boolean;
}

export default function ComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [availableFieldWorkers, setAvailableFieldWorkers] = useState<FieldWorker[]>([]);
  const [selectedFieldWorker, setSelectedFieldWorker] = useState<string | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Fetch available field workers based on complaint category
  const fetchAvailableFieldWorkers = async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('field_workers')
        .select('*')
        .eq('master_category', category)
        .eq('work_status', true);

      if (error) throw error;

      setAvailableFieldWorkers(data || []);
    } catch (err) {
      console.error('Error fetching field workers:', err);
      setError('Could not fetch available field workers');
    }
  };

  // Handle marking complaint as complete
  const handleMarkAsComplete = async (complaint: Complaint) => {
    try {
      // 1. Update the complaint status to completed
      const { error: complaintError } = await supabase
        .from('complaints')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', complaint.id);

      if (complaintError) throw complaintError;

      // 2. Update field worker's work status back to true
      if (complaint.field_worker_assigned) {
        const { error: fieldWorkerError } = await supabase
          .from('field_workers')
          .update({ work_status: true })
          .eq('name', complaint.field_worker_assigned);

        if (fieldWorkerError) throw fieldWorkerError;
      }

      // Refresh complaints
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComplaints(data || []);
    } catch (err) {
      console.error('Error marking complaint as complete:', err);
      setError('Could not mark complaint as complete');
    }
  };

  const handleAssignComplaint = async () => {
    if (!selectedComplaint || !selectedFieldWorker) {
      console.error('No complaint or field worker selected');
      return;
    }

    try {
      // 1. Update the complaint
      const { error: complaintError } = await supabase
        .from('complaints')
        .update({ 
          field_worker_assigned: selectedFieldWorker,
          status: 'in_progress',
          deadline_date: selectedDeadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', selectedComplaint.id);

      if (complaintError) throw complaintError;

      // 2. Update field worker's work status
      const { error: fieldWorkerError } = await supabase
        .from('field_workers')
        .update({ work_status: false })
        .eq('name', selectedFieldWorker);

      if (fieldWorkerError) throw fieldWorkerError;

      // Refresh complaints
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComplaints(data || []);
      
      // Reset states
      setSelectedComplaint(null);
      setSelectedFieldWorker(null);
      setSelectedDeadline('');
    } catch (err) {
      console.error('Error assigning complaint:', err);
      setError('Could not assign complaint');
    }
  };

  // Fetch complaints from Supabase
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setComplaints(data || []);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Completed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            in process
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Pending
          </Badge>
        );
    }
  };

  // Get card border color based on status
  const getCardBorderColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'w-full border-l-4 border-l-green-500';
      case 'in_progress':
        return 'w-full border-l-4 border-l-red-500';
      case 'pending':
      default:
        return 'w-full border-l-4 border-l-gray-400';
    }
  };

  // Format date to be more readable
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Remove @c.us from phone number
  const formatPhoneNumber = (phone: string) => {
    return phone.replace('@c.us', '');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading complaints...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading complaints: {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Complaints</h1>
        </div>

        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {complaints.map((complaint) => (
                  <Card 
                    key={complaint.id} 
                    className={`w-full ${getCardBorderColor(complaint.status)}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {complaint.category} / <br /> <br /> {complaint.subcategory}
                        </CardTitle>
                        {getStatusBadge(complaint.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            Phone Number: {formatPhoneNumber(complaint.user_phone)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            Address: {complaint.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            Complaint Date: {formatDate(complaint.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            Field Worker: {complaint.status === 'pending' || !complaint.field_worker_assigned 
                              ? 'Not Assigned' 
                              : complaint.field_worker_assigned}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            Deadline: {complaint.status === 'pending' || !complaint.deadline_date 
                              ? 'Not Assigned' 
                              : formatDate(complaint.deadline_date)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {complaint.status.toLowerCase() === 'pending' ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                fetchAvailableFieldWorkers(complaint.category);
                              }}
                            >
                              Assign Complaint
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Complaint</DialogTitle>
                              <DialogDescription>
                                Assign this complaint to an available field worker
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="fieldWorker" className="text-right">
                                  Field Worker
                                </Label>
                                <Select 
                                  onValueChange={setSelectedFieldWorker}
                                  value={selectedFieldWorker || undefined}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select field worker" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableFieldWorkers.length > 0 ? (
                                      availableFieldWorkers.map((worker) => (
                                        <SelectItem 
                                          key={worker.id} 
                                          value={worker.name}
                                        >
                                          {worker.name} - {worker.master_category}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <div className="p-2 text-center text-gray-500">
                                        No available field workers
                                      </div>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="deadline" className="text-right">
                                  Deadline
                                </Label>
                                <Input 
                                  id="deadline" 
                                  type="date" 
                                  className="col-span-3"
                                  value={selectedDeadline}
                                  onChange={(e) => setSelectedDeadline(e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button 
                                type="submit" 
                                onClick={handleAssignComplaint}
                                disabled={!selectedFieldWorker}
                              >
                                Assign
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : complaint.status.toLowerCase() === 'in_progress' ? (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleMarkAsComplete(complaint)}
                        >
                          Mark as Complete
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
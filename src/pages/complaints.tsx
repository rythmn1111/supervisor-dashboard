import React, { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Calendar } from 'lucide-react';
import Link from 'next/link';

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

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        setError(err.message);
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
      case 'not_completed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Not Completed
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
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {complaints.map((complaint) => (
                  <Card 
                    key={complaint.id} 
                    className="w-full border-l-4 border-l-gray-400"
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
                            Phone Number :  {formatPhoneNumber(complaint.user_phone)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            Complaint Date : {formatDate(complaint.created_at)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
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
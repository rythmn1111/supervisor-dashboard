// pages/complaints.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Calendar, UserCircle } from 'lucide-react';
import Link from 'next/link';

// Types
interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'not_completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  completedAt?: string;
  department: string;
  phoneNumber: string;
  category: string;
  deadline: string;
  assignedTo: {
    id: string;
    name: string;
  };
}

// Mock complaints data
const complaintsData: Complaint[] = [
  {
    id: '1',
    title: 'Network Issues',
    description: 'Frequent network disconnections in Block A',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-02-15',
    department: 'IT',
    phoneNumber: '+1234567890',
    category: 'Technical',
    deadline: '2024-02-20',
    assignedTo: {
      id: '1',
      name: 'John Doe'
    }
  },
  {
    id: '2',
    title: 'AC Maintenance',
    description: 'AC not cooling properly in meeting room 2',
    status: 'completed',
    priority: 'medium',
    createdAt: '2024-02-10',
    completedAt: '2024-02-12',
    department: 'Maintenance',
    phoneNumber: '+1234567891',
    category: 'Maintenance',
    deadline: '2024-02-15',
    assignedTo: {
      id: '2',
      name: 'Jane Smith'
    }
  },
  {
    id: '3',
    title: 'Software License Issue',
    description: 'Unable to activate design software',
    status: 'not_completed',
    priority: 'low',
    createdAt: '2024-02-14',
    department: 'IT',
    phoneNumber: '+1234567892',
    category: 'Software',
    deadline: '2024-02-25',
    assignedTo: {
      id: '3',
      name: 'Mike Johnson'
    }
  },
  {
    id: '4',
    title: 'Parking Area Lighting',
    description: 'Several lights in parking area B are not working',
    status: 'completed',
    priority: 'medium',
    createdAt: '2024-02-05',
    completedAt: '2024-02-08',
    department: 'Facilities',
    phoneNumber: '+1234567893',
    category: 'Electrical',
    deadline: '2024-02-10',
    assignedTo: {
      id: '4',
      name: 'Sarah Williams'
    }
  },
  {
    id: '5',
    title: 'Water Leakage',
    description: 'Water leaking from ceiling in corridor near office 302',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-02-17',
    department: 'Maintenance',
    phoneNumber: '+1234567894',
    category: 'Plumbing',
    deadline: '2024-02-19',
    assignedTo: {
      id: '5',
      name: 'Alex Brown'
    }
  },
  {
    id: '6',
    title: 'Printer Malfunction',
    description: 'Main printer in design department showing error code E502',
    status: 'not_completed',
    priority: 'medium',
    createdAt: '2024-02-18',
    department: 'IT',
    phoneNumber: '+1234567895',
    category: 'Hardware',
    deadline: '2024-02-22',
    assignedTo: {
      id: '1',
      name: 'John Doe'
    }
  }
];

export default function ComplaintsPage() {
  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
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

  // Function to get card border color based on status
  const getCardBorderClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-l-4 border-l-green-400';
      case 'not_completed':
        return 'border-l-4 border-l-red-400';
      case 'pending':
      default:
        return 'border-l-4 border-l-gray-400';
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto flex h-16 items-center justify-center py-4 px-4">
          <div className="w-full max-w-7xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Complaints Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, Supervisor</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid w-full max-w-xl grid-cols-4 h-auto">
                <TabsTrigger value="all">All Complaints</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="not_completed">Not Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {complaintsData.map((complaint) => (
                  <Card key={complaint.id} className={`w-full ${getCardBorderClass(complaint.status)}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        {getStatusBadge(complaint.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600 mb-4">{complaint.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{complaint.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{complaint.category}</Badge>
                          <Badge variant="outline">{complaint.department}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Assigned: {formatDate(complaint.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Deadline: {formatDate(complaint.deadline)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Assigned to: {complaint.assignedTo.name}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {complaintsData.filter(complaint => complaint.status === 'completed').map((complaint) => (
                  <Card key={complaint.id} className={`w-full ${getCardBorderClass(complaint.status)}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        {getStatusBadge(complaint.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600 mb-4">{complaint.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{complaint.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{complaint.category}</Badge>
                          <Badge variant="outline">{complaint.department}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Assigned: {formatDate(complaint.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Deadline: {formatDate(complaint.deadline)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Assigned to: {complaint.assignedTo.name}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="not_completed" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {complaintsData.filter(complaint => complaint.status === 'not_completed').map((complaint) => (
                  <Card key={complaint.id} className={`w-full ${getCardBorderClass(complaint.status)}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        {getStatusBadge(complaint.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600 mb-4">{complaint.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{complaint.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{complaint.category}</Badge>
                          <Badge variant="outline">{complaint.department}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Assigned: {formatDate(complaint.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Deadline: {formatDate(complaint.deadline)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Assigned to: {complaint.assignedTo.name}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {complaintsData.filter(complaint => complaint.status === 'pending').map((complaint) => (
                  <Card key={complaint.id} className={`w-full ${getCardBorderClass(complaint.status)}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        {getStatusBadge(complaint.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600 mb-4">{complaint.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{complaint.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{complaint.category}</Badge>
                          <Badge variant="outline">{complaint.department}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Assigned: {formatDate(complaint.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Deadline: {formatDate(complaint.deadline)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Assigned to: {complaint.assignedTo.name}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">View Details</Button>
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
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart,
  Bar,
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { 
  ArrowUpRight, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Phone, 
  Calendar, 
  UserCircle,
  LayoutDashboard,
  FileText,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define mock data for complaintsByStatus
const complaintsByStatus = [
  { name: 'Pending', value: 10 },
  { name: 'Completed', value: 20 },
  { name: 'Not Completed', value: 5 },
];

// Define COLORS array for the PieChart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Define mock data for complaintsByDepartment
const complaintsByDepartment = [
  { name: 'HR', open: 5, closed: 10 },
  { name: 'IT', open: 8, closed: 12 },
  { name: 'Finance', open: 3, closed: 7 },
];

// Define mock data for monthlyStats
const monthlyStats = [
  { month: 'January', open: 10, closed: 5 },
  { month: 'February', open: 15, closed: 10 },
  { month: 'March', open: 20, closed: 15 },
];

// Define mock data for staffPerformance
const staffPerformance = [
  { name: 'John Doe', resolved: 15, averageResolutionTime: 24 },
  { name: 'Jane Smith', resolved: 20, averageResolutionTime: 18 },
  { name: 'Alice Johnson', resolved: 10, averageResolutionTime: 30 },
];

// Utility function to format dates
function formatDate(date: string | Date): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

export default function Dashboard() {
  const router = useRouter();
  const [viewComplaints, setViewComplaints] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  function filteredComplaints() {
    const allComplaints: Complaint[] = [
      {
        id: 1,
        title: 'System Issue',
        description: 'The system is not responding.',
        phoneNumber: '123-456-7890',
        category: 'Technical',
        department: 'IT',
        createdAt: '2023-01-01',
        deadline: '2023-01-10',
        status: 'pending',
        assignedTo: { name: 'John Doe' },
      },
      {
        id: 2,
        title: 'Payroll Error',
        description: 'Incorrect salary credited.',
        phoneNumber: '987-654-3210',
        category: 'Finance',
        department: 'HR',
        createdAt: '2023-01-05',
        deadline: '2023-01-15',
        status: 'completed',
        assignedTo: { name: 'Jane Smith' },
      },
      {
        id: 3,
        title: 'Network Downtime',
        description: 'Internet is down in the office.',
        phoneNumber: '555-555-5555',
        category: 'Technical',
        department: 'IT',
        createdAt: '2023-01-03',
        deadline: '2023-01-12',
        status: 'not_completed',
        assignedTo: { name: 'Alice Johnson' },
      },
    ];

    if (activeTab === 'all') {
      return allComplaints;
    }

    return allComplaints.filter((complaint) => complaint.status === activeTab);
  }

  function getCardBorderClass(status: string) {
    switch (status) {
      case 'completed':
        return 'border-green-500';
      case 'not_completed':
        return 'border-red-500';
      case 'pending':
        return 'border-yellow-500';
      default:
        return 'border-gray-300';
    }
  }

  // Other existing functions remain the same...

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar section remains the same */}
      
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold lg:text-2xl">Supervisor Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, Supervisor</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto py-6 px-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {!viewComplaints && (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
                  <Card className="w-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/complaints')}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-500">Total Complaints</span>
                          <span className="text-3xl font-bold">{complaintsByStatus.reduce((acc, curr) => acc + curr.value, 0)}</span>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-full">
                          <AlertCircle className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="w-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    router.push('/complaints');
                    localStorage.setItem('activeComplaintTab', 'pending');
                  }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-500">Not Assigned</span>
                          <span className="text-3xl font-bold">{complaintsByStatus[0].value}</span>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-full">
                          <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="w-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    router.push('/complaints');
                    localStorage.setItem('activeComplaintTab', 'in_progress');
                  }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-500">In Process</span>
                          <span className="text-3xl font-bold">{complaintsByStatus[0].value}</span>
                        </div>
                        <div className="p-2 bg-orange-100 rounded-full">
                          <Phone className="h-8 w-8 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="w-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    router.push('/complaints');
                    localStorage.setItem('activeComplaintTab', 'completed');
                  }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-500">Completed</span>
                          <span className="text-3xl font-bold">{complaintsByStatus[1].value}</span>
                        </div>
                        <div className="p-2 bg-green-100 rounded-full">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Rest of the existing dashboard code remains the same */}
                {/* ... */}
                
                <Tabs defaultValue="overview" className="w-full">
                  <div className="flex justify-center mb-6">
                    <TabsList className="grid w-full max-w-md grid-cols-3 h-auto">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="departments">By Department</TabsTrigger>
                      <TabsTrigger value="staff">Staff Performance</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="overview" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 justify-items-center">
                      <Card className="w-full">
                        <CardHeader className="text-center">
                          <CardTitle>Complaints Status</CardTitle>
                          <CardDescription>Current open vs. closed complaints</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={complaintsByStatus}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {complaintsByStatus.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                      <Card className="w-full">
                        <CardHeader className="text-center">
                          <CardTitle>Monthly Trends</CardTitle>
                          <CardDescription>Complaints opened and closed by month</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                              data={monthlyStats}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="open" stroke="#FF8042" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="closed" stroke="#0088FE" />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="departments" className="mt-6">
                    <Card className="w-full max-w-4xl mx-auto">
                      <CardHeader className="text-center">
                        <CardTitle>Complaints by Department</CardTitle>
                        <CardDescription>Open and closed complaints across departments</CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-center">
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart
                            data={complaintsByDepartment}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="open" fill="#FF8042" name="Open" />
                            <Bar dataKey="closed" fill="#0088FE" name="Closed" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="staff" className="mt-6">
                    <Card className="w-full max-w-4xl mx-auto">
                      <CardHeader className="text-center">
                        <CardTitle>Staff Performance</CardTitle>
                        <CardDescription>Complaints resolved per staff member</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b bg-gray-50">
                                <th className="px-4 py-3 text-center font-medium">Staff Member</th>
                                <th className="px-4 py-3 text-center font-medium">Resolved Complaints</th>
                                <th className="px-4 py-3 text-center font-medium">Avg. Resolution Time (hrs)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {staffPerformance.map((staff, i) => (
                                <tr key={i} className={i % 2 ? 'bg-gray-50' : 'bg-white'}>
                                  <td className="px-4 py-3 text-center">{staff.name}</td>
                                  <td className="px-4 py-3 text-center">{staff.resolved}</td>
                                  <td className="px-4 py-3 text-center">{staff.averageResolutionTime}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
            
            {/* Rest of the existing code remains the same */}
            {/* ... */}
                        
            {viewComplaints && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setViewComplaints(false)}
                    >
                      <ArrowUpRight className="h-5 w-5 rotate-180" />
                    </Button>
                    <h2 className="text-xl font-bold">Complaints Management</h2>
                  </div>
                  <Button variant="outline" size="sm">
                    + Add New Complaint
                  </Button>
                </div>
                
                <Tabs 
                  defaultValue="all" 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="flex justify-center mb-6">
                    <TabsList className="grid w-full max-w-xl grid-cols-4 h-auto">
                      <TabsTrigger value="all">All Complaints</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="not_completed">Not Completed</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value={activeTab} className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredComplaints().map((complaint: Complaint) => (
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
                          <div className="p-6 pt-0">
                          <div className="flex gap-2 w-full">
                            <Button variant="outline" size="sm" className="flex-1">
                            View Details
                            </Button>
                            {complaint.status === 'pending' && (
                            <Button variant="outline" size="sm" className="flex-1">
                              Update Status
                            </Button>
                            )}
                          </div>
                          </div>
                        </Card>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
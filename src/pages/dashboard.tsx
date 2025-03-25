// pages/dashboard.tsx
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
  UserCog,
  Settings,
  Bell,
  BarChart2,
  Menu,
  X,
  LogOut
} from 'lucide-react';
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

interface MonthlyStat {
  month: string;
  open: number;
  closed: number;
}

interface StaffPerformance {
  name: string;
  resolved: number;
  averageResolutionTime: number; // in hours
}

interface DepartmentStat {
  name: string;
  open: number;
  closed: number;
}

// Mock data
const complaintsByStatus = [
  { name: 'Open', value: 34 },
  { name: 'Closed', value: 78 },
];

const complaintsByDepartment: DepartmentStat[] = [
  { name: 'Sales', open: 12, closed: 25 },
  { name: 'Support', open: 9, closed: 31 },
  { name: 'Product', open: 8, closed: 14 },
  { name: 'Finance', open: 5, closed: 8 },
];

const monthlyStats: MonthlyStat[] = [
  { month: 'Jan', open: 24, closed: 35 },
  { month: 'Feb', open: 28, closed: 42 },
  { month: 'Mar', open: 30, closed: 48 },
  { month: 'Apr', open: 34, closed: 52 },
  { month: 'May', open: 32, closed: 58 },
  { month: 'Jun', open: 30, closed: 62 },
];

const staffPerformance: StaffPerformance[] = [
  { name: 'John Doe', resolved: 28, averageResolutionTime: 12.5 },
  { name: 'Jane Smith', resolved: 32, averageResolutionTime: 10.2 },
  { name: 'Mike Johnson', resolved: 18, averageResolutionTime: 15.8 },
  { name: 'Sarah Williams', resolved: 24, averageResolutionTime: 11.3 },
  { name: 'Alex Brown', resolved: 26, averageResolutionTime: 13.7 },
];

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Sidebar navigation items
const sidebarNavItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    title: "Complaints",
    icon: <FileText className="h-5 w-5" />,
    href: "/complaints",
  },
  {
    title: "Staff Management",
    icon: <UserCog className="h-5 w-5" />,
    href: "/staff",
  },
  {
    title: "Field Workers",
    icon: <Users className="h-5 w-5" />,
    href: "/field-workers",
  },
  {
    title: "Departments",
    icon: <Users className="h-5 w-5" />,
    href: "/departments",
  },
  {
    title: "Reports",
    icon: <BarChart2 className="h-5 w-5" />,
    href: "/reports",
  },
  {
    title: "Notifications",
    icon: <Bell className="h-5 w-5" />,
    href: "/notifications",
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/settings",
  },
];

export default function Dashboard() {
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

  // Filter complaints based on active tab
  const filteredComplaints = () => {
    if (activeTab === 'all') {
      return complaintsData;
    }
    return complaintsData.filter(complaint => complaint.status === activeTab);
  };

  // Set the active tab and view complaints when clicking on a card
  const handleShowComplaints = (status: string = 'all') => {
    setActiveTab(status);
    setViewComplaints(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Complaint System</h2>
        </div>
        <nav className="flex-1 pt-4">
          <ul>
            {sidebarNavItems.map((item, index) => (
              <li key={index}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm ${
                    item.title === "Dashboard" 
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t mt-auto">
          <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar - mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
             onClick={() => setSidebarOpen(false)}></div>
        
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Complaint System</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 pt-4">
            <ul>
              {sidebarNavItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm ${
                      item.title === "Dashboard" 
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t mt-auto">
            <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
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
                  <Card className="w-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleShowComplaints('all')}>
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
                  <Card className="w-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleShowComplaints('pending')}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-500">Open Complaints</span>
                          <span className="text-3xl font-bold">{complaintsByStatus[0].value}</span>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-full">
                          <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="w-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleShowComplaints('completed')}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-500">Closed Complaints</span>
                          <span className="text-3xl font-bold">{complaintsByStatus[1].value}</span>
                        </div>
                        <div className="p-2 bg-green-100 rounded-full">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="w-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-500">Staff Members</span>
                          <span className="text-3xl font-bold">{staffPerformance.length}</span>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-full">
                          <Users className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

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
                      {filteredComplaints().map((complaint) => (
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
import AdminLayout from './layout';
import { Card } from '@/components/ui/card';
import { Building, Users, DollarSign, TrendingUp, Eye, MessageSquare, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Sample data for charts
const propertyViewsData = [
  { name: 'Jan', views: 400 },
  { name: 'Feb', views: 300 },
  { name: 'Mar', views: 600 },
  { name: 'Apr', views: 800 },
  { name: 'May', views: 500 },
  { name: 'Jun', views: 900 },
];

const propertyTypeData = [
  { name: 'Apartment', value: 40 },
  { name: 'House', value: 30 },
  { name: 'Villa', value: 15 },
  { name: 'Commercial', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const recentProperties = [
  { id: 1, title: 'Modern Apartment in Downtown', price: '$250,000', views: 124, inquiries: 8, status: 'Active' },
  { id: 2, title: 'Luxury Villa with Pool', price: '$1,200,000', views: 89, inquiries: 5, status: 'Active' },
  { id: 3, title: 'Commercial Space in Business District', price: '$450,000', views: 67, inquiries: 3, status: 'Pending' },
  { id: 4, title: 'Cozy Studio near University', price: '$120,000', views: 45, inquiries: 2, status: 'Sold' },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Properties</p>
                <h3 className="text-2xl font-bold">124</h3>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold">$1.2M</h3>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">842</h3>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <h3 className="text-2xl font-bold">3.2%</h3>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Property Views (Last 6 Months)</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={propertyViewsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Property Types Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        {/* Recent Properties */}
          <h2 className="text-lg font-medium mb-4">Recent Properties</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiries</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentProperties.map((property) => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Eye size={16} className="mr-1 text-gray-400" />
                        {property.views}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MessageSquare size={16} className="mr-1 text-gray-400" />
                        {property.inquiries}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === 'Active' ? 'bg-green-100 text-green-800' : property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {property.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        {/* Performance Metrics */}
          <h2 className="text-lg font-medium mb-0">Performance Metrics</h2>
        <Card className='border-none hover:shadow-none'>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Eye className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-medium">Average Views per Property</h3>
              </div>
              <p className="text-2xl font-bold">78</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-medium">Inquiry Conversion Rate</h3>
              </div>
              <p className="text-2xl font-bold">5.7%</p>
              <p className="text-xs text-red-600 mt-1">↓ 2% from last month</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-medium">Avg. Days on Market</h3>
              </div>
              <p className="text-2xl font-bold">32</p>
              <p className="text-xs text-green-600 mt-1">↑ 8% faster than last month</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
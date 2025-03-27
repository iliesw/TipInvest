import { useState } from 'react';
import AdminLayout from '../layout';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, ChevronDown, Filter } from 'lucide-react';

// Sample data for charts
const monthlyViewsData = [
  { name: 'Jan', views: 4000, inquiries: 2400 },
  { name: 'Feb', views: 3000, inquiries: 1398 },
  { name: 'Mar', views: 2000, inquiries: 9800 },
  { name: 'Apr', views: 2780, inquiries: 3908 },
  { name: 'May', views: 1890, inquiries: 4800 },
  { name: 'Jun', views: 2390, inquiries: 3800 },
  { name: 'Jul', views: 3490, inquiries: 4300 },
  { name: 'Aug', views: 4000, inquiries: 2400 },
  { name: 'Sep', views: 3000, inquiries: 1398 },
  { name: 'Oct', views: 2000, inquiries: 9800 },
  { name: 'Nov', views: 2780, inquiries: 3908 },
  { name: 'Dec', views: 1890, inquiries: 4800 },
];

const propertyTypeData = [
  { name: 'Apartment', value: 40 },
  { name: 'House', value: 30 },
  { name: 'Villa', value: 15 },
  { name: 'Studio', value: 10 },
  { name: 'Commercial', value: 5 },
];

const locationData = [
  { name: 'New York', value: 35 },
  { name: 'Miami', value: 25 },
  { name: 'Chicago', value: 20 },
  { name: 'Los Angeles', value: 15 },
  { name: 'Other', value: 5 },
];

const priceRangeData = [
  { name: '<$100k', value: 10 },
  { name: '$100k-$250k', value: 25 },
  { name: '$250k-$500k', value: 35 },
  { name: '$500k-$1M', value: 20 },
  { name: '>$1M', value: 10 },
];

const conversionRateData = [
  { name: 'Jan', rate: 2.5 },
  { name: 'Feb', rate: 3.1 },
  { name: 'Mar', rate: 2.8 },
  { name: 'Apr', rate: 3.5 },
  { name: 'May', rate: 3.2 },
  { name: 'Jun', rate: 3.8 },
  { name: 'Jul', rate: 4.0 },
  { name: 'Aug', rate: 3.7 },
  { name: 'Sep', rate: 3.5 },
  { name: 'Oct', rate: 3.9 },
  { name: 'Nov', rate: 4.2 },
  { name: 'Dec', rate: 4.5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Analytics() {
  const [timeRange] = useState('Year');
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics</h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center px-4 py-2 bg-white border rounded-md text-sm">
                <Calendar size={16} className="mr-2" />
                {timeRange}
                <ChevronDown size={16} className="ml-2" />
              </button>
              {/* Time range dropdown would go here */}
            </div>
            
            <button className="flex items-center px-4 py-2 bg-white border rounded-md text-sm">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
          </div>
        </div>
        
        {/* Views and Inquiries Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Property Views & Inquiries</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyViewsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" name="Views" />
                <Bar dataKey="inquiries" fill="#82ca9d" name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Distribution Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Property Type Distribution */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Property Types</h2>
            <div className="h-64">
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
          
          {/* Location Distribution */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Locations</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {locationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Price Range Distribution */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Price Ranges</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priceRangeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priceRangeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        {/* Conversion Rate Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Conversion Rate (Inquiries to Sales)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={conversionRateData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#8884d8" activeDot={{ r: 8 }} name="Conversion Rate (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-500">Avg. Views per Property</h3>
              <p className="text-3xl font-bold mt-2">78</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-500">Avg. Inquiries per Property</h3>
              <p className="text-3xl font-bold mt-2">5.7</p>
              <p className="text-xs text-red-600 mt-1">↓ 2% from last month</p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-500">Avg. Days on Market</h3>
              <p className="text-3xl font-bold mt-2">32</p>
              <p className="text-xs text-green-600 mt-1">↑ 8% faster than last month</p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-500">Total Sales Value</h3>
              <p className="text-3xl font-bold mt-2">$4.2M</p>
              <p className="text-xs text-green-600 mt-1">↑ 15% from last month</p>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
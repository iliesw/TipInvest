/* eslint-disable @typescript-eslint/ban-ts-comment */
import useFetch from '@/lib/fetch';
import AdminLayout from './layout';
import { Card } from '@/components/ui/card';
import { Building, Users, DollarSign, TrendingUp, Eye, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Sample data for charts


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


export default function AdminDashboard() {

  const [recentProperties,setrecentProperties] = useState<[]>()
  const [stats,setStats] = useState<{
    listings:number,
    users:number,
  }>()
  const [propertyTypeData,setPropertyTypeData] = useState([])
  const [propertylocationData,setpropertylocationData] = useState([])
  const [averageViews,setAverageViews] = useState(0)
  const [inquiryConversionRate] = useState(0)
  const [conversionRate,setConversionRate] = useState(0)
  useEffect(() => {
    useFetch.get("/admin/realestate").then(res => res.json()).then(data => {
      setrecentProperties(data); 
      //@ts-ignore
      const propertyTypes = data.reduce((acc, property) => {
        const type = property.details.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const propertyTypeArray = Object.entries(propertyTypes).map(([name, value]) => ({
        name,
        value
      }));
      //@ts-ignore

      setPropertyTypeData(propertyTypeArray);
      // calculate location distrbution 
      const locationDistribution = {};
      let totalProperties = 0;
      
      //@ts-ignore
      // Count properties per location
      data.forEach((property) => {
        const location = property.details.location;
      //@ts-ignore
        locationDistribution[location] = (locationDistribution[location] || 0) + 1;
        totalProperties++;
      });

      // Convert to array of objects with percentages
      const locationData = Object.entries(locationDistribution).map(([name, count]) => ({
        name,
      //@ts-ignore
        value: ((count / totalProperties) * 100)
      }));

      //@ts-ignore
      setpropertylocationData(locationData);
      
      
      let totalViews = 0;
      //@ts-ignore
      data.forEach((property) => {
        totalViews += parseFloat(property.views);
      });
      setAverageViews(totalViews / data.length);
      
      // setInquiryConversionRate(totalInquiries / totalViews);
      // setAvgDaysOnMarket(totalDaysOnMarket / data.length);
    })
    useFetch.get("/admin/dashboard/stats").then(res => res.json()).then(data => {
      setStats(data);
    })
    //calculate distribution of property types
  },[])

  useEffect(()=>{
    useFetch.get("/admin/dashboard/views")
      .then(res => res.json()).then(pageViews => {
        
      const totalViews = parseFloat(pageViews[0].views);
      const averagePropertyViews = (averageViews).toFixed(2);
      //@ts-ignore
      const calculatedConversionRate = (averagePropertyViews / totalViews) * 100;
      console.log(calculatedConversionRate)
      setConversionRate(parseFloat(calculatedConversionRate.toFixed(1)));
              
      })
  })

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
              
                <h3 className="text-2xl font-bold">{stats?.listings}</h3>
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
                <h3 className="text-2xl font-bold">{stats?.users}</h3>
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
                <h3 className="text-2xl font-bold">--</h3>
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
                <h3 className="text-2xl font-bold">{conversionRate} %</h3>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Property Location Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertylocationData}
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
                {recentProperties?.map((property) => (
                  <tr key={(property as {title: string}).title}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{(property as {title: string}).title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{(property as {details: {price: string}}).details.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Eye size={16} className="mr-1 text-gray-400" />
                        {(property as {views: number}).views}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MessageSquare size={16} className="mr-1 text-gray-400" />
                        {0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${(property as {status: string}).status === 'available' ? 'bg-green-100 text-green-800' : (property as {status: string}).status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {(property as {status: string}).status}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 w-full bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Eye className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-medium">Average Views per Property</h3>
              </div>
              <p className="text-2xl font-bold">{averageViews}</p>
              {/* <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p> */}
            </div>
            
            <div className="p-4 w-full bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-medium">Inquiry Conversion Rate</h3>
              </div>
              <p className="text-2xl font-bold">{inquiryConversionRate}</p>
              {/* <p className="text-xs text-red-600 mt-1">↓ 2% from last month</p> */}
            </div>
            
            
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
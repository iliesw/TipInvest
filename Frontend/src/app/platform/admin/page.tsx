/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
/* eslint-disable @typescript-eslint/ban-ts-comment */
import useFetch from '@/lib/fetch';
import { Card } from '@/components/ui/card';
import { Building, Users, DollarSign, TrendingUp, Eye, MessageSquare, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Sample data for charts


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


export default function AdminDashboard() {

  const [recentProperties,setrecentProperties] = useState<any[]>([])
  const [stats,setStats] = useState<{
    listings:number,
    users:number,
  }>({ listings: 0, users: 0 })
  const [propertyTypeData,setPropertyTypeData] = useState<any[]>([])
  const [propertylocationData,setpropertylocationData] = useState<any[]>([])
  const [averageViews,setAverageViews] = useState(0)
  const [inquiryConversionRate] = useState(0)
  const [conversionRate,setConversionRate] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  useEffect(() => {
    setLoading(true);
    setError(false);
    
    // Fetch real estate data
    useFetch.get("/admin/realestate")
      .then(res => res.json())
      .then(data => {
        if (!data || !Array.isArray(data) || data.length === 0) {
          setrecentProperties([]);
          setPropertyTypeData([]);
          setpropertylocationData([]);
          setAverageViews(0);
          return;
        }
        
        setrecentProperties(data); 
        
        // Calculate property types distribution
        try {
          const propertyTypes = data.reduce((acc: Record<string, number>, property: any) => {
            const type = property.details?.type || 'Unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {});

          const propertyTypeArray = Object.entries(propertyTypes).map(([name, value]) => ({
            name,
            value
          }));
          
          setPropertyTypeData(propertyTypeArray);
        } catch (err) {
          console.error('Error processing property types:', err);
          setPropertyTypeData([]);
        }
        
        // Calculate location distribution
        try {
          const locationDistribution: Record<string, number> = {};
          let totalProperties = 0;
          
          data.forEach((property: any) => {
            const location = property.details?.location || 'Unknown';
            locationDistribution[location] = (locationDistribution[location] || 0) + 1;
            totalProperties++;
          });

          // Only calculate percentages if we have properties
          if (totalProperties > 0) {
            const locationData = Object.entries(locationDistribution).map(([name, count]) => ({
              name,
              value: ((count / totalProperties) * 100)
            }));
            
            setpropertylocationData(locationData);
          } else {
            setpropertylocationData([]);
          }
        } catch (err) {
          console.error('Error processing location data:', err);
          setpropertylocationData([]);
        }
        
        // Calculate average views
        try {
          let totalViews = 0;
          let validProperties = 0;
          
          data.forEach((property: any) => {
            if (property.views && !isNaN(parseFloat(property.views))) {
              totalViews += parseFloat(property.views);
              validProperties++;
            }
          });
          
          // Only calculate average if we have valid properties
          if (validProperties > 0) {
            setAverageViews(totalViews / validProperties);
          } else {
            setAverageViews(0);
          }
        } catch (err) {
          console.error('Error calculating average views:', err);
          setAverageViews(0);
        }
      })
      .catch(err => {
        console.error('Error fetching real estate data:', err);
        setError(true);
        setrecentProperties([]);
        setPropertyTypeData([]);
        setpropertylocationData([]);
        setAverageViews(0);
      })
      .finally(() => setLoading(false));
    
    // Fetch dashboard stats
    useFetch.get("/admin/dashboard/stats")
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setStats({
            listings: data.listings || 0,
            users: data.users || 0
          });
        }
      })
      .catch(err => {
        console.error('Error fetching dashboard stats:', err);
      });
  }, []);

  useEffect(() => {
    // Only fetch views data if averageViews is valid
    if (averageViews > 0) {
      useFetch.get("/admin/dashboard/views")
        .then(res => res.json())
        .then(pageViews => {
          if (!pageViews || !Array.isArray(pageViews) || pageViews.length === 0 || !pageViews[0]?.views) {
            setConversionRate(0);
            return;
          }
          
          try {
            const totalViews = parseFloat(pageViews[0].views);
            if (isNaN(totalViews) || totalViews === 0) {
              setConversionRate(0);
              return;
            }
            
            const averagePropertyViews = parseFloat(averageViews.toFixed(2));
            const calculatedConversionRate = (averagePropertyViews / totalViews) * 100;
            
            if (!isNaN(calculatedConversionRate) && isFinite(calculatedConversionRate)) {
              setConversionRate(parseFloat(calculatedConversionRate.toFixed(1)));
            } else {
              setConversionRate(0);
            }
          } catch (err) {
            console.error('Error calculating conversion rate:', err);
            setConversionRate(0);
          }
        })
        .catch(err => {
          console.error('Error fetching page views:', err);
          setConversionRate(0);
        });
    }
  }, [averageViews])

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className='animate-spin'></Loader2>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
            <p>There was an error loading the dashboard data. Please try again later.</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Properties</p>
                    <h3 className="text-2xl font-bold">{stats.listings}</h3>
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
                    <h3 className="text-2xl font-bold">{stats.users}</h3>
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
                  {propertylocationData.length > 0 ? (
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
                          {propertylocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No location data available</p>
                    </div>
                  )}
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-lg font-medium mb-4">Property Types Distribution</h2>
                <div className="h-80">
                  {propertyTypeData.length > 0 ? (
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
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No property type data available</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
            
            {/* Recent Properties */}
            <h2 className="text-lg font-medium mb-4">Recent Properties</h2>
            <Card>
              <div className="overflow-x-auto">
                {recentProperties && recentProperties.length > 0 ? (
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
                      {recentProperties.map((property, index) => (
                        <tr key={property?.title || `property-${index}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{property?.title || 'Untitled Property'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{property?.details?.price || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Eye size={16} className="mr-1 text-gray-400" />
                              {property?.views || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <MessageSquare size={16} className="mr-1 text-gray-400" />
                              {0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property?.status === 'available' ? 'bg-green-100 text-green-800' : property?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                              {property?.status || 'Unknown'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No properties available</p>
                  </div>
                )}
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
                  <p className="text-2xl font-bold">{averageViews.toFixed(2) || '0.00'}</p>
                </div>
                
                <div className="p-4 w-full bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-sm font-medium">Inquiry Conversion Rate</h3>
                  </div>
                  <p className="text-2xl font-bold">{inquiryConversionRate.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
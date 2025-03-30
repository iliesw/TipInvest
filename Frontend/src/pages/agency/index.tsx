/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import AgencyLayout from './layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, DollarSign, Users, Clock } from 'lucide-react';
import useFetch from '@/lib/fetch';

export default function AgencyDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    pendingProperties: 0,
    soldProperties: 0,
  });
  
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencyData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('TOKENAUTH');
        
        // Fetch properties owned by this agency
        const response = await useFetch.get('/agency/properties', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Calculate statistics
          const available = data.filter((p: any) => p.status === 'available').length;
          const pending = data.filter((p: any) => p.status === 'pending').length;
          const sold = data.filter((p: any) => p.status === 'sold').length;
          
          setStats({
            totalProperties: data.length,
            availableProperties: available,
            pendingProperties: pending,
            soldProperties: sold,
          });
          
          // Get the 5 most recent properties
          const sortedProperties = [...data].sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).slice(0, 5);
          
          setRecentProperties(sortedProperties);
        } else {
          console.error('Failed to fetch agency properties');
          // Set some sample data for demonstration
          setStats({
            totalProperties: 0,
            availableProperties: 0,
            pendingProperties: 0,
            soldProperties: 0,
          });
          setRecentProperties([]);
        }
      } catch (error) {
        console.error('Error fetching agency data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencyData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <AgencyLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Agency Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
              <p className="text-xs text-muted-foreground">Properties in your portfolio</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableProperties}</div>
              <p className="text-xs text-muted-foreground">Properties on the market</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingProperties}</div>
              <p className="text-xs text-muted-foreground">Properties awaiting approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sold</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.soldProperties}</div>
              <p className="text-xs text-muted-foreground">Properties sold</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : recentProperties.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Property</th>
                      <th className="text-left py-3 px-4">Location</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProperties.map((property) => (
                      <tr key={property.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{property.title}</td>
                        <td className="py-3 px-4">{property.details?.location}</td>
                        <td className="py-3 px-4">{property.details?.price}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${property.status === 'available' ? 'bg-green-100 text-green-800' : property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{formatDate(property.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4">No properties found. Add your first property!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AgencyLayout>
  );
}
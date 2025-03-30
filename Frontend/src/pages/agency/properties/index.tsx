/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import AgencyLayout from '../layout';
import { Card } from '@/components/ui/card';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import useFetch from '@/lib/fetch';
import Notification from '@/components/ui/notification';
import { useRouter } from 'next/router';

export default function AgencyProperties() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    type: 'info' as 'success' | 'error' | 'info',
    message: ''
  });
  
  // Filter properties based on search term and filters
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          property.details?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || property.status === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'All' || property.details?.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('TOKENAUTH');
        const response = await useFetch.get('/agency/properties', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        } else {
          console.error('Failed to fetch properties');
          setNotification({
            show: true,
            type: 'error',
            message: 'Failed to load properties. Please try again later.'
          });
          setProperties([]);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to load properties. Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const token = localStorage.getItem('TOKENAUTH');
        const response = await useFetch.get(`/agency/properties/${id}`, { 
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          setProperties(properties.filter(property => property.id !== id));
          setNotification({
            show: true,
            type: 'success',
            message: 'Property deleted successfully'
          });
        } else {
          const data = await response.json();
          setNotification({
            show: true,
            type: 'error',
            message: data.error || 'Failed to delete property'
          });
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to delete property'
        });
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/agency/properties/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/client/property/${id}`);
  };
  
  return (
    <AgencyLayout>
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          show={notification.show}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Properties</h1>
          
        </div>
        
        {/* Search and Filters */}
        <Card className='border-none rounded-none shadow-none hover:shadow-none'>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
            <div className="md:col-span-2">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Pending">Pending</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
            
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="All">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Studio">Studio</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>
        </Card>
        
        {/* Properties List */}
        <Card className="">
          {loading ? (
            <div className="p-8 text-center">Loading properties...</div>
          ) : filteredProperties.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <tr key={property.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        <div className="text-xs text-gray-500">{new Date(property.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.details?.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.details?.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.details?.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === 'available' ? 'bg-green-100 text-green-800' : property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleView(property.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleEdit(property.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {/* <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-900"
                          > */}
                            <Trash2 size={16} className='text-red-600' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 flex flex-col w-full justify-center items-center">
              <p className="text-gray-500 mb-4">No properties found</p>
              <Link href="/agency/properties/add">
                <button className="inline-flex items-center px-4 py-2 text-white bg-black rounded-md text-sm">
                  <Plus size={16} className="mr-2" />
                  Add Your First Property
                </button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </AgencyLayout>
  );
}
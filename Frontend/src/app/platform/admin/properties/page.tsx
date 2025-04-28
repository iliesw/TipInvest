"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Search, Plus, Edit, Trash2, Eye, Check } from 'lucide-react';
import Link from 'next/link';
import useFetch from '@/lib/fetch';
import Notification from '@/components/ui/notification';


export default function PropertiesList() {
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
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || property.status === statusFilter;
    const matchesType = typeFilter === 'All' || property.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await useFetch.get('/admin/realestate');
        const data = await response.json();
        
        if (response.ok) {
          setProperties(data);
        } else {
          console.error('Failed to fetch properties:', data);
          setNotification({
            show: true,
            type: 'error',
            message: 'Failed to load properties. Using sample data instead.'
          });
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to load properties. Using sample data instead.'
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
        const response = await useFetch.get(`/admin/realestate/${id}`, { method: 'DELETE' });
        
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

  const handleApprove = async (id: string) => {
    if (window.confirm('Are you sure you want to approve this property?')) {
      try {
        const response = await useFetch.get(`/admin/realestate/${id}/approve`, { method: 'POST' });
        
        if (response.ok) {
          // Update the property status in the local state
          setProperties(properties.map(property => 
            property.id === id ? { ...property, status: 'available' } : property
          ));
          setNotification({
            show: true,
            type: 'success',
            message: 'Property approved successfully'
          });
        } else {
          const data = await response.json();
          setNotification({
            show: true,
            type: 'error',
            message: data.error || 'Failed to approve property'
          });
        }
      } catch (error) {
        console.error('Error approving property:', error);
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to approve property'
        });
      }
    }
  };

  const handleDeny = async (id: string) => {
    if (window.confirm('Are you sure you want to deny this property? This will remove it from the system.')) {
      try {
        const response = await useFetch.get(`/admin/realestate/${id}/deny`, { method: 'POST' });
        
        if (response.ok) {
          // Remove the property from the local state
          setProperties(properties.filter(property => property.id !== id));
          setNotification({
            show: true,
            type: 'success',
            message: 'Property denied and removed successfully'
          });
        } else {
          const data = await response.json();
          setNotification({
            show: true,
            type: 'error',
            message: data.error || 'Failed to deny property'
          });
        }
      } catch (error) {
        console.error('Error denying property:', error);
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to deny property'
        });
      }
    }
  };
  
  return (
    <>
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
          <h1 className="text-2xl font-bold">Properties</h1>
          {/* <Link href="/admin/properties/add">
            <button className="flex items-center px-4 py-2  text-white bg-black shadow border
             rounded-md text-sm ">
              <Plus size={16} className="mr-2" />
              Add New Property
            </button>
          </Link> */}
        </div>
        
        {/* Search and Filters */}
        <Card className='border-none rounded-none  shadow-none hover:shadow-none'>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <option value="available">Available</option>
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <tr key={property.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        <div className="text-xs text-gray-500">{property.createdAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.details.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.details.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.details.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === 'available' ? 'bg-green-100 text-green-800' : property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
<div className="text-sm text-gray-900">
  {property.details.bedrooms} bd | {property.details.bathrooms} ba | {Math.round(property.details.area * 0.092903)} m²
</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 items-center">
                          <Link href={`/admin/properties/${property.id}`}>
                            <button className="text-blue-600 hover:text-blue-900 flex flex-col items-center">
                              <Eye size={18} />
                            </button>
                          </Link>
                          {property.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => handleApprove(property.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Approve property"
                              >
                                <Check size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeny(property.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Deny property"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                          {property.status !== 'Pending' && (
                            <button 
                              onClick={() => handleDelete(property.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No properties found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
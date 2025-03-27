import { useState } from 'react';
import AdminLayout from '../layout';
import { Card } from '@/components/ui/card';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

// Sample property data
const sampleProperties = [
  {
    id: 1,
    title: 'Modern Apartment in Downtown',
    location: 'New York, USA',
    price: '$250,000',
    type: 'Apartment',
    status: 'Active',
    bedrooms: 2,
    bathrooms: 2,
    area: '1,200 sq ft',
    createdAt: '2023-05-15',
  },
  {
    id: 2,
    title: 'Luxury Villa with Pool',
    location: 'Miami, USA',
    price: '$1,200,000',
    type: 'Villa',
    status: 'Active',
    bedrooms: 5,
    bathrooms: 4,
    area: '4,500 sq ft',
    createdAt: '2023-06-02',
  },
  {
    id: 3,
    title: 'Commercial Space in Business District',
    location: 'Chicago, USA',
    price: '$450,000',
    type: 'Commercial',
    status: 'Pending',
    bedrooms: 0,
    bathrooms: 2,
    area: '2,000 sq ft',
    createdAt: '2023-06-10',
  },
  {
    id: 4,
    title: 'Cozy Studio near University',
    location: 'Boston, USA',
    price: '$120,000',
    type: 'Studio',
    status: 'Sold',
    bedrooms: 1,
    bathrooms: 1,
    area: '600 sq ft',
    createdAt: '2023-04-22',
  },
  {
    id: 5,
    title: 'Family House with Garden',
    location: 'Seattle, USA',
    price: '$380,000',
    type: 'House',
    status: 'Active',
    bedrooms: 4,
    bathrooms: 3,
    area: '2,800 sq ft',
    createdAt: '2023-05-30',
  },
];

export default function PropertiesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [properties, setProperties] = useState(sampleProperties);
  
  // Filter properties based on search term and filters
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || property.status === statusFilter;
    const matchesType = typeFilter === 'All' || property.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(property => property.id !== id));
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Properties</h1>
          <Link href="/admin/properties/add">
            <button className="flex items-center px-4 py-2  text-white bg-black shadow border
             rounded-md text-sm ">
              <Plus size={16} className="mr-2" />
              Add New Property
            </button>
          </Link>
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
                <option value="Active">Active</option>
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
                        <div className="text-sm text-gray-900">{property.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === 'Active' ? 'bg-green-100 text-green-800' : property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.bedrooms} bd | {property.bathrooms} ba | {property.area}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link href={`/admin/properties/${property.id}`}>
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye size={18} />
                            </button>
                          </Link>
                          <Link href={`/admin/properties/edit/${property.id}`}>
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <Edit size={18} />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
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
    </AdminLayout>
  );
}
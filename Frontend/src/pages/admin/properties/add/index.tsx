/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react';
import AdminLayout from '../../layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import useFetch from '@/lib/fetch';
import { useRouter } from 'next/router';
import { Checkbox } from '@/components/ui/checkbox';

export default function AddProperty() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    type: 'Apartment',
    status: 'Active',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    features: [],
    customFeatures: [''],
  });

  // Common property features
  const commonFeatures = [
    'Air Conditioning',
    'Balcony',
    'Elevator',
    'Fitness Center',
    'Garage',
    'Garden',
    'High Ceilings',
    'Parking',
    'Pet Friendly',
    'Pool',
    'Security System',
    'Storage',
    'Washer/Dryer',
    'WiFi',
    '24/7 Concierge',
  ];

  // Form validation state
  const [errors, setErrors] = useState({
    title: '',
    location: '',
    price: '',
    area: '',
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Handle number input changes
  const handleNumberChange = (name: string, value: number) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle features array
  const handleFeatureChange = (index: number, value: string) => {
    const updatedCustomFeatures = [...formData.customFeatures];
    updatedCustomFeatures[index] = value;
    setFormData({
      ...formData,
      customFeatures: updatedCustomFeatures,
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      customFeatures: [...formData.customFeatures, ''],
    });
  };

  const removeFeature = (index: number) => {
    const updatedCustomFeatures = [...formData.customFeatures];
    updatedCustomFeatures.splice(index, 1);
    setFormData({
      ...formData,
      customFeatures: updatedCustomFeatures,
    });
  };

  // Handle checkbox features
  const handleFeatureCheckbox = (feature: string) => {
    const updatedFeatures = [...formData.features];
    if (updatedFeatures.includes(feature as never)) {
      // Remove feature if already selected
      const index = updatedFeatures.indexOf(feature as never);
      updatedFeatures.splice(index, 1);
    } else {
      // Add feature if not selected
updatedFeatures.push(feature as never);
    }
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Create preview URLs
      const newImagePreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      
      setImages([...images, ...filesArray]);
      setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    const updatedPreviewUrls = [...imagePreviewUrls];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviewUrls[index]);
    
    updatedImages.splice(index, 1);
    updatedPreviewUrls.splice(index, 1);
    
    setImages(updatedImages);
    setImagePreviewUrls(updatedPreviewUrls);
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      location: '',
      price: '',
      area: '',
    };

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Price must be a number';
      isValid = false;
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
      isValid = false;
    } else if (isNaN(parseFloat(formData.area))) {
      newErrors.area = 'Area must be a number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format data for API
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        // Combine selected predefined features and custom features
        features: [
          ...formData.features,
          ...formData.customFeatures.filter(feature => feature.trim() !== '')
        ],
        // In a real implementation, you would upload images to a storage service
        // and include the URLs in the property data
        imageUrls: [], // This would be populated with actual image URLs after upload
      };
      
      // Remove the customFeatures field as it's not needed in the API
      // @ts-ignore
      delete propertyData.customFeatures;
      
      // Send data to API
      const response = await useFetch.post('/properties', propertyData);
      
      if (response.ok) {
        // Redirect to properties list on success
        router.push('/admin/properties');
      } else {
        throw new Error('Failed to create property');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to create property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Add New Property</h1>
          <Link href="/admin/properties">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Properties
            </Button>
          </Link>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Property Title*</label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter property title"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter property description"
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-1">Location*</label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter property location"
                    className={errors.location ? 'border-red-500' : ''}
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
              </CardContent>
            </Card>
            
            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-1">Price ($)*</label>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter property price"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-1">Property Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </CardContent>
            </Card>
            
            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium mb-1">Bedrooms</label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleNumberChange('bedrooms', Math.max(0, formData.bedrooms - 1))}
                        className="rounded-r-none"
                      >
                        <Minus size={16} />
                      </Button>
                      <Input
                        id="bedrooms"
                        name="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => handleNumberChange('bedrooms', parseInt(e.target.value) || 0)}
                        className="rounded-none text-center"
                        min="0"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleNumberChange('bedrooms', formData.bedrooms + 1)}
                        className="rounded-l-none"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium mb-1">Bathrooms</label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleNumberChange('bathrooms', Math.max(0, formData.bathrooms - 1))}
                        className="rounded-r-none"
                      >
                        <Minus size={16} />
                      </Button>
                      <Input
                        id="bathrooms"
                        name="bathrooms"
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => handleNumberChange('bathrooms', parseInt(e.target.value) || 0)}
                        className="rounded-none text-center"
                        min="0"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleNumberChange('bathrooms', formData.bathrooms + 1)}
                        className="rounded-l-none"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="area" className="block text-sm font-medium mb-1">Area (sq ft)*</label>
                    <Input
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="Enter area"
                      className={errors.area ? 'border-red-500' : ''}
                    />
                    {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Features */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <p className="text-sm text-muted-foreground">Select common features or add custom ones</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Common Features Section */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Common Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {commonFeatures.map((feature) => (
                        <div key={feature} className="flex items-start">
                          <Checkbox
                            id={`feature-${feature}`}
checked={formData.features.includes(feature as never)}
                            onChange={() => handleFeatureCheckbox(feature)}
                            label={feature}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom Features Section */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Custom Features</h3>
                    <div className="space-y-3">
                      {formData.customFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            placeholder={`Custom feature ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeFeature(index)}
                            disabled={formData.customFeatures.length === 1}
                          >
                            <Minus size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addFeature}
                        className="mt-2"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Custom Feature
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Images */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <h3 className="text-sm font-medium">Drag and drop or click to upload</h3>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                  </div>
                  
                  {imagePreviewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Property image ${index + 1}`}
                            className="h-32 w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 flex justify-end space-x-4">
            <Link href="/admin/properties">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Property'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
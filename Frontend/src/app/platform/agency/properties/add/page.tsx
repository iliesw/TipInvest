"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import of LocationPicker component to avoid SSR issues with Leaflet
const LocationPicker = dynamic(
  () => import('@/components/ui/LocationPicker'),
  { ssr: false, loading: () => <p>Loading map...</p> }
);

// MapLoader component to handle the LocationPicker
const MapLoader = ({ onLocationSelect }: { onLocationSelect: (location: { x: number; y: number; address: string }) => void }) => {
  return <LocationPicker onLocationSelect={onLocationSelect} />;
};
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Plus, X, Minus } from 'lucide-react';
import Link from 'next/link';
import useFetch from '@/lib/fetch';
import Notification from '@/components/ui/notification';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

export default function AddProperty() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: 'info' as 'success' | 'error' | 'info',
    message: ''
  });

  // Form state with a more organized structure
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    type: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    features: [] as string[],
    customFeatures: [] as string[],
    coordinates: { x: 0, y: 0 } // Store map coordinates
  });
  
  // Image state
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  // Form validation state
  const [errors, setErrors] = useState({
    title: '',
    location: '',
    price: '',
    area: ''
  });
  
  // Common property features
  const commonFeatures = [
    "Air Conditioning",
    "Balcony",
    "Elevator",
    "Fitness Center",
    "Garage",
    "Garden",
    "High Ceilings",
    "Parking",
    "Pet Friendly",
    "Pool",
    "Security System",
    "Storage",
    "Washer/Dryer",
    "WiFi",
    "24/7 Concierge",
  ];

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
    if (updatedFeatures.includes(feature)) {
      // Remove feature if already selected
      const index = updatedFeatures.indexOf(feature);
      updatedFeatures.splice(index, 1);
    } else {
      // Add feature if not selected
      updatedFeatures.push(feature);
    }
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...selectedFiles]);
      
      // Create preview URLs
      const newImageUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...newImageUrls]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newImageUrls = [...imageUrls];
    URL.revokeObjectURL(newImageUrls[index]); // Clean up URL object
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
  };

  // Form validation
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
    }
    
    if (images.length === 0) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Please upload at least one image.'
      });
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Convert image file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('TOKENAUTH');
      
      // Combine common and custom features
      const allFeatures = [
        ...formData.features,
        ...formData.customFeatures.filter(f => f.trim() !== '')
      ];

      // Convert images to base64
      const imageBase64Array = [];
      if (images.length > 0) {
        for (const image of images) {
          const base64 = await fileToBase64(image);
          imageBase64Array.push(base64);
        }
      }
      
      // Create property data
      const propertyData = {
        title: formData.title,
        description: formData.description,
        details: {
          price: `${formData.price}`,
          location: formData.location,
          type: formData.type,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          area: parseInt(formData.area),
          features: allFeatures,
          images: imageBase64Array, // Include base64 images directly
          coords: formData.coordinates, // Include map coordinates
        },
        status: 'pending', // Properties added by agencies start as pending until approved
      };
      
      // Submit property data with images included
      const response = await useFetch.post('/agency/properties', propertyData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to create property');
      }
      
      setNotification({
        show: true,
        type: 'success',
        message: 'Property submitted successfully! It will be reviewed by an administrator.'
      });
      
      // Redirect after a short delay
      // setTimeout(() => {
      //   router.push('/agency/properties');
      // }, 2000);
      
    } catch (error) {
      console.error('Error submitting property:', error);
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to submit property. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
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
        <div className="flex items-center gap-4">
          <Link href="/platform/agency/properties">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Add New Property</h1>
        </div>
        
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4 md:col-span-2">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.title ? "border-red-500" : ""}`}
                    placeholder="e.g. Modern Apartment in Downtown"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md h-32"
                    placeholder="Describe the property..."
                  />
                </div>
              </div>
              

              
              {/* Property Details */}
              <div className="space-y-4 md:col-span-2">
                <h2 className="text-xl font-semibold">Property Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (USD) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md ${errors.price ? "border-red-500" : ""}`}
                      placeholder="e.g. 250000"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                    )}
                  </div>
                  
                  
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Property Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Studio">Studio</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Area (sq ft) *</label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md ${errors.area ? "border-red-500" : ""}`}
                      placeholder="e.g. 1200"
                    />
                    {errors.area && (
                      <p className="text-red-500 text-xs mt-1">{errors.area}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Bedrooms</label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        size="icon"
                        onClick={() =>
                          handleNumberChange(
                            "bedrooms",
                            Math.max(0, formData.bedrooms - 1)
                          )
                        }
                        className="rounded-r-none"
                      >
                        <Minus size={16} />
                      </Button>
                      <input
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) =>
                          handleNumberChange(
                            "bedrooms",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-16 p-2 border-y text-center"
                        min="0"
                      />
                      <Button
                        type="button"
                        size="icon"
                        onClick={() =>
                          handleNumberChange("bedrooms", formData.bedrooms + 1)
                        }
                        className="rounded-l-none"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Bathrooms</label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        size="icon"
                        onClick={() =>
                          handleNumberChange(
                            "bathrooms",
                            Math.max(0, formData.bathrooms - 1)
                          )
                        }
                        className="rounded-r-none"
                      >
                        <Minus size={16} />
                      </Button>
                      <input
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) =>
                          handleNumberChange(
                            "bathrooms",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-16 p-2 border-y text-center"
                        min="0"
                      />
                      <Button
                        type="button"
                        size="icon"
                        onClick={() =>
                          handleNumberChange("bathrooms", formData.bathrooms + 1)
                        }
                        className="rounded-l-none"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Features */}
              <div className="space-y-4 md:col-span-2">
                <h2 className="text-xl font-semibold">Features</h2>
                <p className="text-sm text-gray-500">Select common features or add custom ones</p>
                
                <div className="space-y-6">
                  {/* Common Features Section */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Common Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {commonFeatures.map((feature) => (
                        <div key={feature} className="flex items-start">
                          <Checkbox
                            id={`feature-${feature}`}
                            checked={formData.features.includes(feature)}
                            onClick={() => handleFeatureCheckbox(feature)}
                          />
                          <label
                            htmlFor={`feature-${feature}`}
                            className="text-sm pl-3 font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {feature}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  
                </div>
              </div>
              
              {/* Images Upload Section */}
              <div className="space-y-4 md:col-span-2">
                <h2 className="text-xl font-semibold">Property Images</h2>
                <p className="text-sm text-gray-500">Upload images of the property (required)</p>
                
                <div className="space-y-4">
                  {/* Image Upload Button */}
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB per image)</p>
                      </div>
                      <input 
                        id="image-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        multiple 
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  
                  {/* Image Previews */}
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={url} 
                            alt={`Property image ${index + 1}`} 
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='w-full h-[100vh]'>
                    {/* Location Map Picker */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Select Location on Map</label>
                      <div className="mt-2">
                        <MapLoader 
                          onLocationSelect={(location) => {
                            setFormData({
                              ...formData,
                              location: location.address || formData.location,
                              coordinates: { x: location.x, y: location.y }
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
            <div className="flex justify-end space-x-4">
              <Link href="/agency/properties">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Property'}
              </Button>
            </div>
          </form>
          
        </Card>
      </div>
    </>
  );
}

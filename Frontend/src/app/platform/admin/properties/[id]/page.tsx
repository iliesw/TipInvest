"use client"
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Home,
  Bath,
  Maximize,
  Check,
  Snowflake,
  Wifi,
  Thermometer,
  Warehouse,
  Trees,
  Car,
  Lock,
  Dumbbell,
  Waves,
  Mountain,
  Flower2,
  Tv,
  PawPrint,
  Phone,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import useFetch from "@/lib/fetch";
import Notification from "@/components/ui/notification";

interface PropertyDetails {
  features: string[];
  images: string[];
  title: string;
  location: string;
  price: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
}

interface Property {
  id: string;
  title: string;
  status: string;
  details: PropertyDetails;
  description: string;
  
  createdAt: string;
  updatedAt: string;
}

interface NotificationType {
  show: boolean;
  type: "success" | "error" | "info";
  message: string;
}

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [notification, setNotification] = useState<NotificationType>({
    show: false,
    type: "info",
    message: "",
  });
  
  // Function to convert square feet to square meters
  const sqFtToSqM = (sqFt: number) => {
    // Convert to square meters (1 sq ft = 0.092903 sq m)
    return Math.round(sqFt * 0.092903);
  };

const FetchImages = async (images: string[]) => {
  const R = [];
  for (const i in images) {
    const response = await useFetch.get(`/admin/realestate/image/${images[i]}`);
    const data = await response.json();
    if (data && data.imageData) {
      R.push(data.imageData);
    }
  }
  return R;
};

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await useFetch.get(`/admin/realestate/${id}`);
        const data = await response.json();

        if (response.ok) {
          setProperty(data);
          // Fetch images only once after property is set
          if (data.details.images && data.details.images.length > 0) {
            const imagePromises = await FetchImages(data.details.images);
            console.log(imagePromises);
            // set the images 
            setProperty({ ...data, details: { ...data.details, images: imagePromises } });
          }
        } else {
          throw new Error("Failed to fetch property details");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        setNotification({
          show: true,
          type: "error",
          message: "Failed to load property details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-full">
          <p>Loading property details...</p>
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <div className="space-y-6">
          <div className="flex items-center">
            <Link href="/admin/properties">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft size={16} className="mr-2" />
                Back to Properties
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Property Not Found</h1>
          </div>

          <Card>
            <CardContent className="p-6">
              <p>
                The property you are looking for does not exist or has been
                removed.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const handleImageChange = (index: number) => {
    setActiveImageIndex(index);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Sold":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getInquiryStatusColor = (status: string): string => {
    switch (status) {
      case "Responded":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };
  
  // Handle property approval
  const handleApprove = async () => {
    if (!id) return;
    
    try {
      const response = await useFetch.get(`/admin/realestate/${id}/approve`, { method: 'POST' });
      
      if (response.ok) {
        // Update the property status locally
        setProperty(property ? { ...property, status: 'available' } : null);
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
  };
  
  // Handle property denial
  const handleDeny = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to deny this property? This will remove it from the system.')) {
      try {
        const response = await useFetch.get(`/admin/realestate/${id}/deny`, { method: 'POST' });
        
        if (response.ok) {
          setNotification({
            show: true,
            type: 'success',
            message: 'Property denied and removed successfully'
          });
          // Redirect back to properties list after denial
          router.push('/admin/properties');
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
        {/* Header with back button and actions */}
        <div className="flex justify-between items-center">
          <Link href="/admin/properties">
            <Button size="sm" className="mr-4 shadow-none">
              <ArrowLeft size={16} className="mr-2" />
              Back to Properties
            </Button>
          </Link>
          
          {property.status === "pending" && (
            <div className="flex space-x-2">
              <Button 
                onClick={handleApprove} 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check size={16} className="mr-2" />
                Approve Property
              </Button>
              <Button 
                onClick={handleDeny} 
                variant="destructive"
              >
                <Trash2 size={16} className="mr-2" />
                Deny Property
              </Button>
            </div>
          )}
        </div>
        {/* Property Images */}
        <Card className="p-0 shadow-none border-none hover:shadow-none overflow-visible">
          <CardContent className="p-0 m-0 overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {property.details.images &&
                  property.details.images.length > 0 ? (
                    <div className="w-full h-full relative">
                      <img
                        src={property.details.images[activeImageIndex]}
                        alt={`${property.details.title} - Image ${
                          activeImageIndex + 1
                        }`}
                        className="w-full h-full object-cover"
                      />
                      <p className="absolute bottom-2 right-2 text-sm text-gray-600 bg-white/80 px-2 py-1 rounded">
                        Image {activeImageIndex + 1} /{" "}
                        {property.details.images.length}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Building size={48} className="text-gray-400" />
                      <p className="text-gray-500 mt-2">No images available</p>
                    </div>
                  )}
                </div>

                {property.details.images &&
                  property.details.images.length > 1 && (
                    <div className="flex mt-4 space-x-2 pb-2 ">
                      {property.details.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleImageChange(index)}
                          className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                            index === activeImageIndex
                              ? "ring-2 ring-black"
                              : ""
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${property.details.title} - Thumbnail ${
                              index + 1
                            }`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <div className="flex items-start">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      property.status
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>
                <h1 className="text-4xl my-4 font-bold">{property.title}</h1>

                <h2 className="text-xl font-semibold mb-4">Property Details</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{property.details.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <DollarSign
                      size={18}
                      className="text-gray-500 mr-2 mt-0.5"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">{property.details.price}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Building size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Property Type</p>
                      <p className="font-medium">{property.details.type}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Listed Date</p>
                      <p className="font-medium">{property.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">{property.updatedAt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Home size={18} className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-medium">{property.details.bedrooms}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Bath size={18} className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-medium">{property.details.bathrooms}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Maximize size={18} className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-medium">{sqFtToSqM(property.details.area)} m² </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.details.features &&
                    property.details.features.map((feature, index) => {
                      // Function to get appropriate icon based on feature name
                      const getFeatureIcon = (featureName: string) => {
                        const featureIcons = {
                          "Air Conditioning": <Snowflake size={16} className="text-blue-500 mr-2" />,
                          "Balcony": <Building size={16} className="text-gray-500 mr-2" />,
                          "Elevator": <ArrowLeft size={16} className="text-gray-500 mr-2" />,
                          "Gym": <Dumbbell size={16} className="text-red-500 mr-2" />,
                          "Fitness Center": <Dumbbell size={16} className="text-red-500 mr-2" />,
                          "Security System": <Lock size={16} className="text-gray-500 mr-2" />,
                          "Swimming Pool": <Waves size={16} className="text-blue-500 mr-2" />,
                          "Garden": <Flower2 size={16} className="text-green-500 mr-2" />,
                          "Garage": <Car size={16} className="text-gray-500 mr-2" />,
                          "Fireplace": <Thermometer size={16} className="text-red-500 mr-2" />,
                          "Smart Home System": <Wifi size={16} className="text-blue-500 mr-2" />,
                          "WiFi": <Wifi size={16} className="text-blue-500 mr-2" />,
                          "Built-in Storage": <Warehouse size={16} className="text-gray-500 mr-2" />,
                          "Storage": <Warehouse size={16} className="text-gray-500 mr-2" />,
                          "Laundry Facilities": <Tv size={16} className="text-gray-500 mr-2" />,
                          "Washer/Dryer": <Tv size={16} className="text-gray-500 mr-2" />,
                          "Pet Friendly": <PawPrint size={16} className="text-amber-500 mr-2" />,
                          "Close to Transit": <MapPin size={16} className="text-red-500 mr-2" />,
                          "Backyard": <Trees size={16} className="text-green-500 mr-2" />,
                          "Basement": <Home size={16} className="text-gray-500 mr-2" />,
                          "School District": <Building size={16} className="text-gray-500 mr-2" />,
                          "Panoramic Views": <Mountain size={16} className="text-blue-500 mr-2" />,
                          "Private Terrace": <Building size={16} className="text-gray-500 mr-2" />,
                          "Concierge": <Phone size={16} className="text-gray-500 mr-2" />,
                          "24/7 Concierge": <Phone size={16} className="text-gray-500 mr-2" />,
                          "Pool": <Waves size={16} className="text-blue-500 mr-2" />,
                          "Pond": <Waves size={16} className="text-blue-500 mr-2" />,
                          "Detached Garage": <Car size={16} className="text-gray-500 mr-2" />,
                          "Parking": <Car size={16} className="text-gray-500 mr-2" />,
                          "Country Views": <Mountain size={16} className="text-blue-500 mr-2" />,
                          "High Ceilings": <Building size={16} className="text-gray-500 mr-2" />,
                        };
                        
                        // Return the icon if it exists, otherwise return a default icon
                        return featureIcons[featureName as keyof typeof featureIcons] || 
                               <Check size={16} className="text-green-500 mr-2" />;
                      };
                      
                      return (
                        <div key={index} className="flex items-center">
                          {getFeatureIcon(feature)}
                          <span className="text-sm">{feature}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{property.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

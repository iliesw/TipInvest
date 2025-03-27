import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../layout";
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
  Eye,
  MessageSquare,
  Check,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";

// Sample property data (would be fetched from API in a real application)
const sampleProperties = [
  {
    id: 1,
    title: "Modern Apartment in Downtown",
    description:
      "A beautiful modern apartment located in the heart of downtown. This property features high ceilings, large windows, and premium finishes throughout. Perfect for young professionals or small families looking for a central location with all amenities nearby.",
    location: "New York, USA",
    price: "$250,000",
    type: "Apartment",
    status: "Active",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,200 sq ft",
    createdAt: "2023-05-15",
    updatedAt: "2023-06-10",
    features: [
      "Air Conditioning",
      "Balcony",
      "Elevator",
      "Fitness Center",
      "Parking",
      "Pet Friendly",
      "Security System",
      "Washer/Dryer",
    ],
    images: [
      "/assets/images/property-1-1.jpg",
      "/assets/images/property-1-2.jpg",
      "/assets/images/property-1-3.jpg",
    ],
    agent: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 123-4567",
    },
    views: 124,
    inquiries: [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 987-6543",
        message:
          "I'm interested in this property. Can I schedule a viewing this weekend?",
        date: "2023-06-05",
        status: "Responded",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+1 (555) 456-7890",
        message:
          "Is this property still available? I would like to know more about the neighborhood.",
        date: "2023-06-08",
        status: "Pending",
      },
    ],
    viewingStats: [
      { month: "Jan", views: 45 },
      { month: "Feb", views: 52 },
      { month: "Mar", views: 61 },
      { month: "Apr", views: 85 },
      { month: "May", views: 124 },
      { month: "Jun", views: 78 },
    ],
  },
  {
    id: 2,
    title: "Luxury Villa with Pool",
    description:
      "An exquisite luxury villa featuring a private pool, spacious garden, and premium finishes throughout. This property offers the perfect blend of comfort, privacy, and elegance. Ideal for families looking for a high-end residence in a prestigious neighborhood.",
    location: "Miami, USA",
    price: "$1,200,000",
    type: "Villa",
    status: "Active",
    bedrooms: 5,
    bathrooms: 4,
    area: "4,500 sq ft",
    createdAt: "2023-06-02",
    updatedAt: "2023-06-15",
    features: [
      "Air Conditioning",
      "Garden",
      "Pool",
      "Garage",
      "Security System",
      "High Ceilings",
      "Washer/Dryer",
      "24/7 Concierge",
    ],
    images: [
      "/assets/images/property-2-1.jpg",
      "/assets/images/property-2-2.jpg",
      "/assets/images/property-2-3.jpg",
    ],
    agent: {
      name: "Robert Johnson",
      email: "robert.j@example.com",
      phone: "+1 (555) 234-5678",
    },
    views: 89,
    inquiries: [
      {
        id: 3,
        name: "Michael Brown",
        email: "michael.b@example.com",
        phone: "+1 (555) 876-5432",
        message:
          "I'm very interested in this villa. Is it possible to arrange a private viewing next week?",
        date: "2023-06-10",
        status: "Responded",
      },
    ],
    viewingStats: [
      { month: "Jan", views: 32 },
      { month: "Feb", views: 41 },
      { month: "Mar", views: 55 },
      { month: "Apr", views: 67 },
      { month: "May", views: 72 },
      { month: "Jun", views: 89 },
    ],
  },
];

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<{
    id: number;
    title: string;
    description: string;
    location: string;
    price: string;
    type: string;
    status: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    createdAt: string;
    updatedAt: string;
    features: string[];
    images: string[];
    agent: {
      name: string;
      email: string;
      phone: string;
    };
    views: number;
    inquiries: Array<{
      id: number;
      name: string;
      email: string;
      phone: string;
      message: string;
      date: string;
      status: string;
    }>;
    viewingStats: Array<{
      month: string;
      views: number;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    // In a real application, this would be an API call
    if (id) {
      const propertyId = parseInt(id as string);
      const foundProperty = sampleProperties.find((p) => p.id === propertyId);

      if (foundProperty) {
        setProperty(foundProperty);
      }

      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading property details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!property) {
    return (
      <AdminLayout>
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
      </AdminLayout>
    );
  }

  const handleImageChange = (index: number) => {
    setActiveImageIndex(index);
  };

  const getStatusColor = (status: string) => {
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

  const getInquiryStatusColor = (status: string) => {
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with back button and actions */}
        <div className="flex justify-between items-center">
          <Link href="/admin/properties">
            <Button size="sm" className="mr-4 shadow-none">
              <ArrowLeft size={16} className="mr-2" />
              Back to Properties
            </Button>
          </Link>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{property.title}</h1>
          </div>

          <div className="flex space-x-2">
            <Link href={`/admin/properties/edit/${property.id}`}>
              <Button variant="outline" size="sm">
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Property Images */}
        <Card className="p-0 shadow-none border-none hover:shadow-none overflow-visible">
          <CardContent className="p-0 m-0 overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <div className="w-full h-full relative">
                      {/* This would be a real image in production */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <Building size={48} className="text-gray-400" />
                        <p className="absolute bottom-2 right-2 text-sm text-gray-600 bg-white px-2 py-1 rounded">
                          Image placeholder ({activeImageIndex + 1}/
                          {property.images.length})
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Building size={48} className="text-gray-400" />
                      <p className="text-gray-500 mt-2">No images available</p>
                    </div>
                  )}
                </div>

                {property.images && property.images.length > 1 && (
                  <div className="flex mt-4 space-x-2 pb-2 ">
                    {property.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                          index === activeImageIndex ? "ring-2 ring-black" : ""
                        }`}
                      >
                        {/* This would be a real image thumbnail in production */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <Building size={24} className="text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{property.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <DollarSign
                      size={18}
                      className="text-gray-500 mr-2 mt-0.5"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">{property.price}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Building size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Property Type</p>
                      <p className="font-medium">{property.type}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        property.status
                      )}`}
                    >
                      {property.status}
                    </span>
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
                    <p className="font-medium">{property.bedrooms}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Bath size={18} className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-medium">{property.bathrooms}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Maximize size={18} className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-medium">{property.area}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <Check size={16} className="text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
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

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Agent Information</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span>{" "}
                    {property.agent.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span>{" "}
                    {property.agent.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span>{" "}
                    {property.agent.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <CardTitle>Performance Metrics</CardTitle>
        <Card className="border-none shadow-none hover:shadow-none">
          <CardContent className="m-0 p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Eye className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-sm font-medium">Total Views</h3>
                </div>
                <p className="text-2xl font-bold">{property.views}</p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 12% from last month
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-sm font-medium">Total Inquiries</h3>
                </div>
                <p className="text-2xl font-bold">
                  {property.inquiries ? property.inquiries.length : 0}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 5% from last month
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-sm font-medium">Days Listed</h3>
                </div>
                <p className="text-2xl font-bold">32</p>
                <p className="text-xs text-gray-600 mt-1">Average: 45 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries */}
        <CardTitle>Inquiries</CardTitle>
        <Card className="border-none hover:shadow-none shadow-none rounded-none">
          {property.inquiries && property.inquiries.length > 0 ? (
            <div className="space-y-4">
              {property.inquiries.map((inquiry: {
                id: number;
                name: string;
                email: string;
                phone: string;
                message: string;
                date: string;
                status: string;
              }) => (
                <div key={inquiry.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{inquiry.name}</h3>
                      <p className="text-sm text-gray-500">
                        {inquiry.email} • {inquiry.phone}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getInquiryStatusColor(
                        inquiry.status
                      )}`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-sm mt-2">{inquiry.message}</p>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-500">
                      Received: {inquiry.date}
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Reply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Mark as Closed
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No inquiries yet for this property.</p>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}

/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LayoutC from "../layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Bed, Bath, Home, Phone, ChevronLeft, ChevronRight, X, Maximize, Wifi, Thermometer, Building, Warehouse, Trees, Car, Lock, Dumbbell, Waves, Mountain, Flower2, Tv, Snowflake, PawPrint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import useFetch from "@/lib/fetch";

interface Property {
  id: number;
  title: string;
  description: string;  
  details: {
    type: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    yearBuilt: number;
    parkingSpaces: number;
    features: string[];
  };
  images: string[];
}

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<Property>();
  const [activeImage, setActiveImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to convert square feet to square meters
  const sqFtToSqM = (sqFt: number) => {
    return Math.round(sqFt * 0.092903);
  };


  useEffect(() => {
    if (id && typeof id === 'string') {
      useFetch.get("/realestate/" + id)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch property');
          }
          return response.json();
        })
        .then(data => {
          setProperty(data);
          console.log(data);
        })
        .catch(error => {
          console.error('Error fetching property:', error);
          router.push('/client/market');
        });
    }
  }, [id, router]);

  return ( (property == null) ?
      (<LayoutC>
        <div className="flex flex-col items-center w-full justify-center h-full">
          
            <p>Loading property details...</p>
        </div>
      </LayoutC>)
    :
    (<LayoutC>
      <div className="w-full mx-auto">
        {/* Back Button */}
        <Button 
          variant="outline" 
          className="mb-6 border-none shadow-none"
          onClick={() => router.push('/client/market')}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Marketplace
        </Button>

        {/* Property Title and Location */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <p className="flex items-center text-gray-600 mt-2">
            <MapPin size={18} className="mr-2" />
            {property.details.location}
          </p>
        </div>

        {/* Image Gallery with Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg group">
              <motion.img 
                src={property.images[activeImage]} 
                alt={`${property.title} - Image ${activeImage + 1}`}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => setIsFullscreen(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                key={activeImage}
              />
              
              {/* Carousel Navigation Buttons */}
              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
                  }}
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
                  }}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
              
              {/* Fullscreen Button */}
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsFullscreen(true)}
              >
                <Maximize size={16} />
              </Button>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {activeImage + 1} / {property.images.length}
              </div>
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {property.images.map((image, index) => (
              <motion.div 
                key={index} 
                className={`relative h-full overflow-hidden rounded-lg cursor-pointer border-2 ${index === activeImage ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setActiveImage(index)}
              >
                <img 
                  src={image} 
                  alt={`${property.title} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === activeImage && (
                  <div className="absolute inset-0 bg-blue-500/10"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Fullscreen Image Viewer */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div 
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFullscreen(false)}
            >
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-4 right-4 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
                onClick={() => setIsFullscreen(false)}
              >
                <X size={20} />
              </Button>
              
              <div className="relative w-full max-w-6xl max-h-[90vh] flex items-center justify-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
                  }}
                >
                  <ChevronLeft size={24} />
                </Button>
                
                <motion.img 
                  src={property.images[activeImage]} 
                  alt={`${property.title} - Image ${activeImage + 1}`}
                  className="max-h-[90vh] max-w-full object-contain"
                  key={`fullscreen-${activeImage}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
                  }}
                >
                  <ChevronRight size={24} />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm px-3 py-1 rounded-full">
                  {activeImage + 1} / {property.images.length}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Property Details and Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Left Column - Description */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg border mb-4">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700">{property.description}</p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <ul className="grid grid-cols-2 gap-2">
                {property.details.features.map((feature, index) => {
                  // Function to get appropriate icon based on feature name
                  const getFeatureIcon = (featureName:string) => {
                    const featureIcons = {
                      "Air Conditioning": <Snowflake size={18} className="mr-2" />,
                      "Balcony": <Building size={18} className="mr-2" />,
                      "Elevator": <ArrowLeft size={18} className="mr-2" />,
                      "Gym": <Dumbbell size={18} className="mr-2" />,
                      "Fitness Center": <Dumbbell size={18} className="mr-2" />,
                      "Security System": <Lock size={18} className="mr-2" />,
                      "Swimming Pool": <Waves size={18} className="mr-2" />,
                      "Garden": <Flower2 size={18} className="mr-2" />,
                      "Garage": <Car size={18} className="mr-2" />,
                      "Fireplace": <Thermometer size={18} className="mr-2" />,
                      "Smart Home System": <Wifi size={18} className="mr-2" />,
                      "WiFi": <Wifi size={18} className="mr-2" />,
                      "Built-in Storage": <Warehouse size={18} className="mr-2" />,
                      "Storage": <Warehouse size={18} className="mr-2" />,
                      "Laundry Facilities": <Tv size={18} className="mr-2" />,
                      "Washer/Dryer": <Tv size={18} className="mr-2" />,
                      "Pet Friendly": <PawPrint size={18} className="mr-2" />,
                      "Close to Transit": <MapPin size={18} className="mr-2" />,
                      "Backyard": <Trees size={18} className="mr-2" />,
                      "Basement": <Home size={18} className="mr-2" />,
                      "School District": <Building size={18} className="mr-2" />,
                      "Panoramic Views": <Mountain size={18} className="mr-2" />,
                      "Private Terrace": <Building size={18} className="mr-2" />,
                      "Concierge": <Phone size={18} className="mr-2" />,
                      "24/7 Concierge": <Phone size={18} className="mr-2" />,
                      "Pool": <Waves size={18} className="mr-2" />,
                      "Pond": <Waves size={18} className="mr-2" />,
                      "Detached Garage": <Car size={18} className="mr-2" />,
                      "Parking": <Car size={18} className="mr-2" />,
                      "Country Views": <Mountain size={18} className="mr-2" />,
                      "High Ceilings": <Building size={18} className="mr-2" />,
                    };
                    
                    // Return the icon if it exists, otherwise return a default icon
                    return (
                      <div className="text-black">
                        {featureIcons[featureName as keyof typeof featureIcons] || <Home size={18} className="mr-2" />}
                      </div>
                    );
                  };
                  
                  return (
                    <li key={index} className="flex items-center py-1">
                      {getFeatureIcon(feature)}
                      {feature}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-lg border mt-4 h-[500px]">
              
              <div className="">
                {typeof window !== 'undefined' && (
                  <>
                    {(() => {
                      const PropertyMapComponent = dynamic(
                        () => import('@/components/ui/PropertyMap'),
                        { ssr: false, loading: () => <p>Loading map...</p> }
                      );
                      return <PropertyMapComponent location={""} title={property.title} />;
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details and Contact */}
          <div>
            {/* Property Details */}
            <div className="bg-white p-6 rounded-lg border mb-4">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              
              <div className="flex justify-between items-end py-6 border-b">
                <span className="text-gray-600">Price</span>
                <span className="font-semibold text-4xl font-[Milk]">${property.details.price.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Property Type</span>
                <span className="capitalize">{property.details.type}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Bedrooms</span>
                <span className="flex items-center">
                  <Bed size={16} className="mr-1" />
                  {property.details.bedrooms}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Bathrooms</span>
                <span className="flex items-center">
                  <Bath size={16} className="mr-1" />
                  {property.details.bathrooms}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-3">
                <span className="text-gray-600">Area</span>
                <span className="flex items-center">
                  <Home size={16} className="mr-1" />
                  {sqFtToSqM(property.details.area)} m²
                </span>
              </div>
              
              
              
              
            </div>

            
          </div>
        </div>
      </div>
    </LayoutC>)
  );
}
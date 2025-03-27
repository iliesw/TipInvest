/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LayoutC from "../layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Bed, Bath, Home, Phone, Mail, Calendar, ChevronLeft, ChevronRight, X, Maximize, Wifi, Thermometer, Building, Warehouse, Trees, Car, Lock, Dumbbell, Waves, Mountain, Flower2, Tv, Snowflake, PawPrint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  yearBuilt: number;
  parkingSpaces: number;
  features: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
  };
  images: string[];
}

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<Property>();
  const [activeImage, setActiveImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock property data - in a real app, you would fetch this from an API
  const properties = [
    {
      id: 1,
      title: "Modern Apartment",
      description: "Beautiful modern apartment in the heart of the city. This stunning property features high ceilings, large windows that allow plenty of natural light, and premium finishes throughout. The open floor plan creates a spacious feel, perfect for entertaining guests. The kitchen is equipped with stainless steel appliances and granite countertops. Located in a secure building with 24/7 concierge service, residents also enjoy access to a fitness center and rooftop terrace.",
      price: 250000,
      location: "Downtown",
      bedrooms: 2,
      bathrooms: 1,
      area: 850,
      type: "apartment",
      yearBuilt: 2018,
      parkingSpaces: 1,
      features: ["Air Conditioning", "Balcony", "Elevator", "Gym", "Security System"],
      agent: {
        name: "Sarah Johnson",
        phone: "+1 (555) 123-4567",
        email: "sarah.j@tipinvest.com"
      },
      images: [
        "/assets/images/thumbs/property-1.png",
        "/assets/images/thumbs/property-details-1.png",
        "/assets/images/thumbs/property-details-2.png",
        "/assets/images/thumbs/property-details-3.png"
      ]
    },
    {
      id: 2,
      title: "Luxury Villa",
      description: "Spacious luxury villa with garden and pool. This magnificent property sits on a large lot with beautifully landscaped gardens. The interior features high-end finishes, including marble floors, custom cabinetry, and designer lighting fixtures. The gourmet kitchen is a chef's dream with top-of-the-line appliances. The master suite includes a spa-like bathroom and walk-in closet. Outside, enjoy the private swimming pool, outdoor kitchen, and covered patio perfect for year-round entertaining.",
      price: 750000,
      location: "Suburbs",
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      type: "house",
      yearBuilt: 2015,
      parkingSpaces: 2,
      features: ["Swimming Pool", "Garden", "Garage", "Fireplace", "Smart Home System"],
      agent: {
        name: "Michael Chen",
        phone: "+1 (555) 987-6543",
        email: "michael.c@tipinvest.com"
      },
      images: [
        "/assets/images/thumbs/property-2.png",
        "/assets/images/thumbs/property-details-1.png",
        "/assets/images/thumbs/property-details-2.png",
        "/assets/images/thumbs/property-details-4.png"
      ]
    },
    {
      id: 3,
      title: "Cozy Studio",
      description: "Cozy studio apartment perfect for singles or couples. This efficiently designed studio makes excellent use of space with built-in storage solutions and multi-functional furniture. The kitchen area includes all necessary appliances and the bathroom has been recently renovated with modern fixtures. Located in a vibrant neighborhood with easy access to public transportation, restaurants, and shopping. The building offers laundry facilities and a small community garden.",
      price: 120000,
      location: "Midtown",
      bedrooms: 1,
      bathrooms: 1,
      area: 450,
      type: "apartment",
      yearBuilt: 2010,
      parkingSpaces: 0,
      features: ["Built-in Storage", "Laundry Facilities", "Pet Friendly", "Close to Transit"],
      agent: {
        name: "Emma Rodriguez",
        phone: "+1 (555) 234-5678",
        email: "emma.r@tipinvest.com"
      },
      images: [
        "/assets/images/thumbs/property-3.png",
        "/assets/images/thumbs/property-details-2.png",
        "/assets/images/thumbs/property-details-3.png",
        "/assets/images/thumbs/property-details-4.png"
      ]
    },
    {
      id: 4,
      title: "Family Home",
      description: "Perfect family home with large backyard. This welcoming family home offers plenty of space for everyone with a thoughtful floor plan that includes formal and informal living areas. The kitchen opens to a family room, creating a great space for gathering. Upstairs, find spacious bedrooms and a bonus room that could serve as a home office or playroom. The large backyard is fully fenced and includes a covered patio and play area. Located in a top-rated school district with easy access to parks and community amenities.",
      price: 450000,
      location: "Suburbs",
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      type: "house",
      yearBuilt: 2005,
      parkingSpaces: 2,
      features: ["Backyard", "Garage", "Basement", "Fireplace", "School District"],
      agent: {
        name: "David Wilson",
        phone: "+1 (555) 345-6789",
        email: "david.w@tipinvest.com"
      },
      images: [
        "/assets/images/thumbs/property-4.png",
        "/assets/images/thumbs/property-details-1.png",
        "/assets/images/thumbs/property-details-3.png",
        "/assets/images/thumbs/property-details-4.png"
      ]
    },
    {
      id: 5,
      title: "Penthouse Suite",
      description: "Luxurious penthouse with panoramic city views. This spectacular penthouse offers unparalleled luxury with floor-to-ceiling windows showcasing breathtaking city views from every room. The open concept living area features a designer kitchen with custom cabinetry and high-end appliances. The master suite includes a spa-inspired bathroom with soaking tub and separate shower. Additional features include a private terrace, home automation system, and premium finishes throughout. Building amenities include concierge service, fitness center, and rooftop pool.",
      price: 900000,
      location: "Downtown",
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      type: "apartment",
      yearBuilt: 2020,
      parkingSpaces: 2,
      features: ["Panoramic Views", "Private Terrace", "Concierge", "Fitness Center", "Pool"],
      agent: {
        name: "Olivia Park",
        phone: "+1 (555) 456-7890",
        email: "olivia.p@tipinvest.com"
      },
      images: [
        "/assets/images/thumbs/property-5.png",
        "/assets/images/thumbs/property-details-1.png",
        "/assets/images/thumbs/property-details-2.png",
        "/assets/images/thumbs/property-details-3.png"
      ]
    },
    {
      id: 6,
      title: "Countryside Cottage",
      description: "Charming cottage in a peaceful countryside setting. This idyllic cottage offers a perfect retreat from city life with its tranquil setting and charming character. The interior features exposed beams, a stone fireplace, and hardwood floors throughout. The kitchen has been updated with modern appliances while maintaining its rustic charm. Outside, enjoy the beautiful garden with mature trees and a small pond. The property includes a detached garage that could be converted into a studio or workshop. Located just a short drive from local amenities while offering privacy and serenity.",
      price: 320000,
      location: "Rural",
      bedrooms: 2,
      bathrooms: 1,
      area: 1200,
      type: "house",
      yearBuilt: 1985,
      parkingSpaces: 1,
      features: ["Fireplace", "Garden", "Pond", "Detached Garage", "Country Views"],
      agent: {
        name: "James Taylor",
        phone: "+1 (555) 567-8901",
        email: "james.t@tipinvest.com"
      },
      images: [
        "/assets/images/thumbs/property-6.png",
        "/assets/images/thumbs/property-details-2.png",
        "/assets/images/thumbs/property-details-3.png",
        "/assets/images/thumbs/property-details-4.png"
      ]
    }
  ];

  useEffect(() => {
    if (id) {
      // Find the property with the matching ID
      const foundProperty = properties.find(p => p.id === Number(id));
      if (foundProperty) {
        // @ts-ignore
        setProperty(foundProperty);
      }
    }
  }, [id]);

  if (!property) {
    return (
      <LayoutC>
        <div className="flex flex-col items-center justify-center h-full">
          <p>Loading property details...</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/client/market')}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Marketplace
          </Button>
        </div>
      </LayoutC>
    );
  }

  return (
    <LayoutC>
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
            {property.location}
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
                {property.features.map((feature, index) => {
                  // Function to get appropriate icon based on feature name
                  const getFeatureIcon = (featureName:string) => {
                    const featureIcons = {
                      "Air Conditioning": <Snowflake size={18} className="mr-2" />,
                      "Balcony": <Building size={18} className="mr-2" />,
                      "Elevator": <ArrowLeft size={18} className="text-blue-e-90" />,
                      "Gym": <Dumbbell size={18} className="mr-2" />,
                      "Security System": <Lock size={18} className="mr-2" />,
                      "Swimming Pool": <Waves size={18} className="mr-2" />,
                      "Garden": <Flower2 size={18} className="mr-2" />,
                      "Garage": <Car size={18} className="mr-2" />,
                      "Fireplace": <Thermometer size={18} className="mr-2" />,
                      "Smart Home System": <Wifi size={18} className="mr-2" />,
                      "Built-in Storage": <Warehouse size={18} className="mr-2" />,
                      "Laundry Facilities": <Tv size={18} className="mr-2" />,
                      "Pet Friendly": <PawPrint size={18} className="mr-2" />,
                      "Close to Transit": <MapPin size={18} className="mr-2" />,
                      "Backyard": <Trees size={18} className="mr-2" />,
                      "Basement": <Home size={18} className="mr-2" />,
                      "School District": <Building size={18} className="mr-2" />,
                      "Panoramic Views": <Mountain size={18} className="mr-2" />,
                      "Private Terrace": <Building size={18} className="mr-2" />,
                      "Concierge": <Phone size={18} className="mr-2" />,
                      "Fitness Center": <Dumbbell size={18} className="mr-2" />,
                      "Pool": <Waves size={18} className="mr-2" />,
                      "Pond": <Waves size={18} className="mr-2" />,
                      "Detached Garage": <Car size={18} className="mr-2" />,
                      "Country Views": <Mountain size={18} className="mr-2" />,
                    };
                    
                    // Return the icon if it exists, otherwise return a default icon
                    return <div className="text-black">{featureIcons[featureName as keyof typeof featureIcons]} </div>;
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
                      return <PropertyMapComponent location={property.location} title={property.title} />;
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
                <span className="font-semibold text-4xl font-[Milk]">${property.price.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Property Type</span>
                <span className="capitalize">{property.type}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Bedrooms</span>
                <span className="flex items-center">
                  <Bed size={16} className="mr-1" />
                  {property.bedrooms}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Bathrooms</span>
                <span className="flex items-center">
                  <Bath size={16} className="mr-1" />
                  {property.bathrooms}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Area</span>
                <span className="flex items-center">
                  <Home size={16} className="mr-1" />
                  {property.area} ft²
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Year Built</span>
                <span className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {property.yearBuilt}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Parking Spaces</span>
                <span>{property.parkingSpaces}</span>
              </div>
            </div>

            {/* Agent Contact */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Contact Agent</h2>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                  {property.agent.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{property.agent.name}</p>
                  <p className="text-sm text-gray-600">Real Estate Agent</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <a href={`tel:${property.agent.phone}`} className="flex items-center text-gray-700 hover:text-blue-600">
                  <Phone size={16} className="mr-2" />
                  {property.agent.phone}
                </a>
                
                <a href={`mailto:${property.agent.email}`} className="flex items-center text-gray-700 hover:text-blue-600">
                  <Mail size={16} className="mr-2" />
                  {property.agent.email}
                </a>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </LayoutC>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import LayoutC from "./layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin, Bed, Bath, Home, ArrowRight, X, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Market() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [propertyType, setPropertyType] = useState("all");
  const [location, setLocation] = useState("all");

  // Mock property data
  const properties = [
    {
      id: 1,
      title: "Modern Apartment",
      description: "Beautiful modern apartment in the heart of the city",
      price: 250000,
      location: "Downtown",
      bedrooms: 2,
      bathrooms: 1,
      area: 850,
      type: "apartment",
      image: "/assets/images/thumbs/property-1.png"
    },
    {
      id: 2,
      title: "Luxury Villa",
      description: "Spacious luxury villa with garden and pool",
      price: 750000,
      location: "Suburbs",
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      type: "house",
      image: "/assets/images/thumbs/property-2.png"
    },
    {
      id: 3,
      title: "Cozy Studio",
      description: "Cozy studio apartment perfect for singles or couples",
      price: 120000,
      location: "Midtown",
      bedrooms: 1,
      bathrooms: 1,
      area: 450,
      type: "apartment",
      image: "/assets/images/thumbs/property-3.png"
    },
    {
      id: 4,
      title: "Family Home",
      description: "Perfect family home with large backyard",
      price: 450000,
      location: "Suburbs",
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      type: "house",
      image: "/assets/images/thumbs/property-4.png"
    },
    {
      id: 5,
      title: "Penthouse Suite",
      description: "Luxurious penthouse with panoramic city views",
      price: 900000,
      location: "Downtown",
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      type: "apartment",
      image: "/assets/images/thumbs/property-5.png"
    },
    {
      id: 6,
      title: "Countryside Cottage",
      description: "Charming cottage in a peaceful countryside setting",
      price: 320000,
      location: "Rural",
      bedrooms: 2,
      bathrooms: 1,
      area: 1200,
      type: "house",
      image: "/assets/images/thumbs/property-6.png"
    }
  ];

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    
    const matchesType = propertyType === "all" || property.type === propertyType;
    
    const matchesLocation = location === "all" || property.location === location;
    
    return matchesSearch && matchesPrice && matchesType && matchesLocation;
  });

  // Function to handle property click (navigates to property detail page)
  const handlePropertyClick = (propertyId: number) => {
    router.push(`/client/property/${propertyId}`);
  };

  // Function to reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 1000000]);
    setPropertyType("all");
    setLocation("all");
  };

  // Check if any filter is active
  const isFilterActive = 
    searchTerm !== "" || 
    priceRange[0] !== 0 || 
    priceRange[1] !== 1000000 || 
    propertyType !== "all" || 
    location !== "all";

  return (
    <LayoutC>
      <motion.div 
        className="w-full pr-2 mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section with Animation */}
        <motion.div 
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 p-6 mb-8 text-white shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Real Estate Marketplace</h1>
            <p className="mt-2 max-w-2xl text-blue-50">
              Discover your perfect investment property from our exclusive listings
            </p>
          </motion.div>
          <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-blue-500 opacity-50"></div>
          <div className="absolute -top-4 -right-16 h-40 w-40 rounded-full bg-blue-300 opacity-30"></div>
        </motion.div>
        
        {/* Search and Filter Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by title, description or location..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Button with Active Indicator */}
            <Button 
              variant={isFilterActive ? "default" : "outline"} 
              className="flex items-center gap-2 rounded-lg"
            >
              <Filter size={18} />
              Filters {isFilterActive && <span className="bg-white text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">!</span>}
            </Button>

            {/* Reset Button - Only shows when filters are active */}
            {isFilterActive && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 rounded-lg" 
                onClick={resetFilters}
              >
                <X size={18} />
                Reset
              </Button>
            )}
          </div>
          
          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Price Range</label>
              <select 
                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                value={`${priceRange[0]}-${priceRange[1]}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  setPriceRange([min, max]);
                }}
              >
                <option value="0-1000000">All Prices</option>
                <option value="0-200000">Under $200,000</option>
                <option value="200000-400000">$200,000 - $400,000</option>
                <option value="400000-600000">$400,000 - $600,000</option>
                <option value="600000-1000000">$600,000+</option>
              </select>
            </div>
            
            {/* Property Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Property Type</label>
              <select 
                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
              </select>
            </div>
            
            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Location</label>
              <select 
                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="Downtown">Downtown</option>
                <option value="Midtown">Midtown</option>
                <option value="Suburbs">Suburbs</option>
                <option value="Rural">Rural</option>
              </select>
            </div>
          </div>

          {/* Filter Summary - Shows when filters are active */}
          {isFilterActive && (
            <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchTerm && (
                <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")} className="hover:text-blue-600">
                    <X size={14} />
                  </button>
                </span>
              )}
              {(priceRange[0] !== 0 || priceRange[1] !== 1000000) && (
                <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                  Price: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  <button onClick={() => setPriceRange([0, 1000000])} className="hover:text-blue-600">
                    <X size={14} />
                  </button>
                </span>
              )}
              {propertyType !== "all" && (
                <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                  Type: {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
                  <button onClick={() => setPropertyType("all")} className="hover:text-blue-600">
                    <X size={14} />
                  </button>
                </span>
              )}
              {location !== "all" && (
                <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                  Location: {location}
                  <button onClick={() => setLocation("all")} className="hover:text-blue-600">
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </motion.div>
        
        {/* Property Listings with Count */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Available Properties <span className="text-blue-600 text-lg ml-2">{filteredProperties.length}</span></h2>
          <p className="text-sm text-gray-500">{filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (index % 3) }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card 
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full border-gray-100"
                onClick={() => handlePropertyClick(property.id)}
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-3 rounded-lg font-medium shadow-sm">
                    ${property.price.toLocaleString()}
                  </div>
                  <button 
                    className="absolute top-0 left-0 m-3 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Favorite functionality would go here
                    }}
                  >
                    <Heart size={18} className="text-gray-500 hover:text-red-500 transition-colors" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-16"></div>
                </div>
                
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-lg font-bold">{property.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-gray-500">
                    <MapPin size={14} />
                    {property.location}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-3 pb-4 border-t">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded-md">
                      <Bed size={14} className="text-blue-500" />
                      {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded-md">
                      <Bath size={14} className="text-blue-500" />
                      {property.bathrooms}
                    </span>
                    <span className="flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded-md">
                      <Home size={14} className="text-blue-500" />
                      {property.area} ft²
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-blue-50 rounded-full">
                    <ArrowRight size={16} className="text-blue-600" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* No Results Message */}
        {filteredProperties.length === 0 && (
          <motion.div 
            className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Search size={32} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-gray-500 max-w-md mb-6">We couldn&apos;t find any properties matching your current filters. Try adjusting your search criteria or reset all filters.</p>
            <Button 
              variant="default" 
              className="px-6 py-2 rounded-lg"
              onClick={resetFilters}
            >
              <X size={18} className="mr-2" />
              Reset All Filters
            </Button>
          </motion.div>
        )}
      </motion.div>
    </LayoutC>
  );
}
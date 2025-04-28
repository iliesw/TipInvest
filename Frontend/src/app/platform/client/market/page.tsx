/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Bed, Bath, Home, X, Heart } from "lucide-react";
import { motion } from "framer-motion";
import useFetch from "@/lib/fetch";

export default function Market() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [propertyType, setPropertyType] = useState("all");
  const [location, setLocation] = useState("all");

  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);

  const [properties, setProperties] = useState<
    {
      id: string;
      title: string;
      description: string;
      images: string[];
      status: string;
      ownerId: string;
      createdAt: string;
      updatedAt: string;
      details: {
        images: any;
        location: string;
        price: string;
        type: string;
        status: string;
        bedrooms: number;
        bathrooms: number;
        area: number;
      };
      agency?: {
        id: string;
        name: string;
        email: string;
      };
    }[]
  >([]);

  useEffect(() => {
    useFetch
      .get("/realestate")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        // Extract unique locations from properties
        const locations = [
          ...new Set(data.map((property: any) => property.details.location)),
        ];
        //@ts-ignore
        setUniqueLocations(locations);
        console.log(data);
      });
  }, []);

  // Filter properties based on search and filters
  const filteredProperties = properties.filter((property) => {
    // Search term filter (case-insensitive)
    const matchesSearch =
      searchTerm === "" ||
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.details.location
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Price range filter
    const propertyPrice = parseFloat(
      property.details.price.replace(/[^0-9.-]+/g, "")
    );
    const matchesPrice =
      propertyPrice >= priceRange[0] && propertyPrice <= priceRange[1];

    // Property type filter
    const matchesType =
      propertyType === "all" ||
      property.details.type.toLowerCase() === propertyType.toLowerCase();

    // Location filter
    const matchesLocation =
      location === "all" || property.details.location.includes(location);

    return matchesSearch && matchesPrice && matchesType && matchesLocation;
  });

  // Function to convert square feet to square meters
  const sqFtToSqM = (sqFt: number) => {
    return Math.round(sqFt * 0.092903);
  };

  // Function to handle property click (navigates to property detail page)
  const handlePropertyClick = (propertyId: string) => {
    router.push(`/platform/client/market/${propertyId}`);
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
            Discover your perfect investment property from our exclusive
            listings
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
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by title, description or location..."
              className="w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-black transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Button with Active Indicator */}

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Price Range */}
          <div className="space-y-4">
            <select
              className="w-full p-3 border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              value={`${priceRange[0]}-${priceRange[1]}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split("-").map(Number);
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
          <div className="space-y-4">
            <select
              className="w-full p-3 border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <select
              className="w-full p-3 border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
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
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:text-blue-600"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {(priceRange[0] !== 0 || priceRange[1] !== 1000000) && (
              <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                Price: ${priceRange[0].toLocaleString()} - $
                {priceRange[1].toLocaleString()}
                <button
                  onClick={() => setPriceRange([0, 1000000])}
                  className="hover:text-blue-600"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {propertyType !== "all" && (
              <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                Type:{" "}
                {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
                <button
                  onClick={() => setPropertyType("all")}
                  className="hover:text-blue-600"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {location !== "all" && (
              <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                Location: {location}
                <button
                  onClick={() => setLocation("all")}
                  className="hover:text-blue-600"
                >
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Property Listings with Count */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Available Properties{" "}
          <span className="text-blue-600 text-lg ml-2">
            {filteredProperties.length}
          </span>
        </h2>
        <p className="text-sm text-gray-500">
          {filteredProperties.length}{" "}
          {filteredProperties.length === 1 ? "property" : "properties"} filtered
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {properties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * (index % 3) }}
          >
            <Card
              className="overflow-hidden aspect-[1/.8] transition-all hover:shadow-none cursor-pointer border-none shadow-none h-full rounded-none"
              onClick={() => handlePropertyClick(property.id)}
            >
              <div className="relative w-full rounded-md overflow-hidden">
                <img
                  src={property.details.images[0]}
                  alt={property.title}
                  className="w-full h-full rounded-lg object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/600 to-transparent h-16"></div>
                <div className="absolute bottom-1 left-2 text-white px-3 py-1 rounded-full flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1 text-sm bg-[#ffffff50] border border-[#ffffff70] px-3 py-1 rounded-full backdrop-blur-sm">
                    <Bed size={14} className="" />
                    {property.details.bedrooms}{" "}
                    {property.details.bedrooms === 1 ? "bed" : "beds"}
                  </span>
                  <span className="flex items-center gap-1 text-sm bg-[#ffffff50] border border-[#ffffff70] px-3 py-1 rounded-full backdrop-blur-sm">
                    <Bath size={14} className="" />
                    {property.details.bathrooms}{" "}
                    {property.details.bathrooms === 1 ? "bath" : "baths"}
                  </span>
                  <span className="flex items-center gap-1 text-sm bg-[#ffffff50] border border-[#ffffff70] px-3 py-1 rounded-full backdrop-blur-sm">
                    <Home size={14} className="" />
                    {sqFtToSqM(property.details.area)} m²
                  </span>
                </div>

                {/* Featured tag similar to "Coup de cœur voyageurs" */}
                <div className="absolute top-4 left-4 bg-white text-gray-800 px-3 py-1 rounded-full font-medium shadow-sm text-sm">
                  Featured Property
                </div>
                <button
                  className="absolute top-4 bg-white right-4 bg-transparent p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Favorite functionality would go here
                  }}
                >
                  <Heart
                    size={18}
                    className="text-black hover:text-red-500 transition-colors"
                  />
                </button>
              </div>

              <div className="pt-4 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-1/2">
                    <h3 className="text-lg font-semibold">{property.title}</h3>
                    <p className="flex  items-center gap-1 text-gray-600 text-sm">
                      <MapPin size={14} className="min-w-5" />
                      <span className="text-nowrap text-ellipsis overflow-hidden ">
                        {property.details.location}
                      </span>
                    </p>
                  </div>
                  <div className="font-semibold text-lg flex flex-col justify-end items-end">
                    ${property.details.price.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      Price
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results Message */}
      {properties.length === 0 && (
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
          <p className="text-gray-500 max-w-md mb-6">
            We couldn&apos;t find any properties matching your current filters.
            Try adjusting your search criteria or reset all filters.
          </p>
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
  );
}

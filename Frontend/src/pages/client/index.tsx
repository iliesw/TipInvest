import LayoutC from "./layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SquareTerminal, Store, LifeBuoy, Calendar, Clock, ArrowRight, MapPin, Bed, Bath, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import useFetch from "@/lib/fetch";

interface Meeting {
  id: string;
  scheduledTime: string;
  duration: number;
  status: string;
  topic: string;
  expert: {
    id: string;
    name: string;
    specialization: string;
  } | null;
}

interface Property {
  id: string;
  title: string;
  images: string[];
  details: {
    location: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
  };
  createdAt: string;
}

export default function ClientView() {
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [newProperties, setNewProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState({
    meetings: true,
    properties: true
  });

  useEffect(() => {
    // Fetch user data when component mounts
    const token = localStorage.getItem("TOKENAUTH");
    if (token) {


      // Fetch upcoming meetings
      useFetch.get("/client/meetings")
        .then(res => res.json())
        .then(data => {
          if (data.meetings) {
            // Sort by date and take only upcoming meetings (max 3)
            const upcoming = data.meetings
              .filter((meeting: Meeting) => meeting.status === 'scheduled')
              .sort((a: Meeting, b: Meeting) => 
                new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
              .slice(0, 3);
            setUpcomingMeetings(upcoming);
          }
          setLoading(prev => ({ ...prev, meetings: false }));
        })
        .catch(err => {
          console.error("Error fetching meetings:", err);
          setLoading(prev => ({ ...prev, meetings: false }));
        });

      // Fetch new properties
      useFetch.get("/realestate")
        .then(res => res.json())
        .then(data => {
          // Sort by creation date (newest first) and take only 3
          const newest = [...data]
            .sort((a: Property, b: Property) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);
          setNewProperties(newest);
          setLoading(prev => ({ ...prev, properties: false }));
        })
        .catch(err => {
          console.error("Error fetching properties:", err);
          setLoading(prev => ({ ...prev, properties: false }));
        });
    }
  }, []);

  const features = [
    {
      title: "Property Simulator",
      description:
        "Analyze potential investments and calculate ROI ",
      icon: <SquareTerminal className="h-5 w-5" />,
      link: "/client/simulator",
      color: "white",
    },
    {
      title: "Marketplace",
      description:
        "Browse exclusive property listings and investment opportunities",
      icon: <Store className="h-5 w-5" />,
      link: "/client/market",
      color: "white",
    },
    {
      title: "Ai Assistant",
      description:
        "Get help from our Ai agent for any questions or concerns",
      icon: <LifeBuoy className="h-5 w-5" />,
      link: "#",
      color: "white",
    },
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <LayoutC>
      <motion.div 
        className="w-full space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        {/* Feature Guide Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h2 
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >Get Started</motion.h2>
          <motion.p 
            className="text-gray-500 mt-0 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Follow these steps to make the most of your TipInvest experience
          </motion.p>

          <motion.div 
            className="grid grid-cols-3 gap-3 md:grid-cols-3 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{transition: { duration: 0.2 } }}
              >
                <Card
                  className={`overflow-hidden transition-all p-3 hover:shadow-md ${feature.color}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-black p-2 bg-gray-100 rounded-full">{feature.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-xs truncate">{feature.description}</CardDescription>
                    </div>
                    <Link href={feature.link}>
                      <Button 
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-8 w-8 p-0 flex items-center justify-center" 
                        size="sm"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Upcoming Meetings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <motion.div className="flex justify-between items-center mb-4">
            <div>
              <motion.h2 
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >Upcoming Meetings</motion.h2>
              <motion.p 
                className="text-gray-500 mt-0 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Your scheduled consultations with real estate experts
              </motion.p>
            </div>
           
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {loading.meetings ? (
              <div className="col-span-3 flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ transition: { duration: 0.2 } }}
                >
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Scheduled
                        </span>
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg">
                        {meeting.topic}
                      </CardTitle>
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(meeting.scheduledTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{meeting.duration} minutes</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Link href={`/client/meetings/${meeting.id}`} className="w-full">
                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="col-span-3 p-6 text-center">
                <p className="text-gray-500 mb-4">You don&apos;t have any upcoming meetings.</p>
                <Link href="/client/experts">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Find an Expert
                  </Button>
                </Link>
              </Card>
            )}
          </motion.div>
        </motion.div>

        {/* New Real Estate Listings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <motion.div className="flex justify-between items-center mb-4">
            <div>
              <motion.h2 
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >New Real Estate Listings</motion.h2>
              <motion.p 
                className="text-gray-500 mt-0 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Recently added properties to our marketplace
              </motion.p>
            </div>
            
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {loading.properties ? (
              <div className="col-span-3 flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : newProperties.length > 0 ? (
              newProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ transition: { duration: 0.2 } }}
                >
                  <Link href={`/client/property/${property.id}`} className="block">
                    <Card 
                      className="overflow-hidden transition-all hover:shadow-none cursor-pointer border-none shadow-none h-full rounded-none"
                    >
                    <div className="relative aspect-[1/.6] w-full rounded-md overflow-hidden">
                      <img 
                        src={property.images[0] || '/placeholder-property.jpg'} 
                        alt={property.title}
                        className="w-full h-full rounded-lg object-cover  transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/600 to-transparent h-16"></div>
                      <div className="absolute bottom-1 left-2 text-white px-3 py-1 rounded-full flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1 text-sm bg-[#ffffff50] border border-[#ffffff70] px-3 py-1 rounded-full backdrop-blur-sm">
                          <Bed size={14} />
                          {property.details.bedrooms} {property.details.bedrooms === 1 ? 'bed' : 'beds'}
                        </span>
                        <span className="flex items-center gap-1 text-sm bg-[#ffffff50] border border-[#ffffff70] px-3 py-1 rounded-full backdrop-blur-sm">
                          <Bath size={14} />
                          {property.details.bathrooms} {property.details.bathrooms === 1 ? 'bath' : 'baths'}
                        </span>
                      </div>
                      
                      <div className="absolute top-4 left-4 bg-white text-gray-800 px-3 py-1 rounded-full font-medium shadow-sm text-sm">
                        New Property
                      </div>
                      <button 
                        className="absolute top-4 bg-white right-4 bg-transparent p-2 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          // Favorite functionality would go here
                        }}
                      >
                        <Heart size={18} className="text-black hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                    
                    <div className="pt-4 pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{property.title}</h3>
                          <p className="flex items-center gap-1 text-gray-600 text-sm">
                            <MapPin size={14} />
                            {property.details.location}
                          </p>
                        </div>
                        <div className="font-semibold text-lg flex flex-col justify-end items-end">
                          {property.details.price} <span className="text-sm font-normal text-gray-500">
                            Price
                          </span>
                        </div>
                      </div>
                      
                      
                    </div>
                  </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <Card className="col-span-3 p-6 text-center">
                <p className="text-gray-500 mb-4">No new properties available at the moment.</p>
                <Link href="/client/market">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Browse Marketplace
                  </Button>
                </Link>
              </Card>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </LayoutC>
  );
}

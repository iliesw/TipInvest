"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SquareTerminal,
  Store,
  LifeBuoy,
  Calendar,
  Clock,
  MapPin,
  Bed,
  Bath,
  Heart,
  Loader2,
  ChevronsRightIcon,
} from "lucide-react";
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
    properties: true,
  });

  useEffect(() => {
    // Fetch user data when component mounts
      // Fetch upcoming meetings
      useFetch
        .get("/client/meetings")
        .then((res) => res.json())
        .then((data) => {
          if (data.meetings) {
            // Sort by date and take only upcoming meetings (max 3)
            const upcoming = data.meetings
              .filter((meeting: Meeting) => meeting.status === "scheduled")
              .sort(
                (a: Meeting, b: Meeting) =>
                  new Date(a.scheduledTime).getTime() -
                  new Date(b.scheduledTime).getTime()
              )
              .slice(0, 3);
            setUpcomingMeetings(upcoming);
          }
          setLoading((prev) => ({ ...prev, meetings: false }));
        })
        .catch((err) => {
          console.error("Error fetching meetings:", err);
          setLoading((prev) => ({ ...prev, meetings: false }));
        });

      // Fetch new properties
      useFetch
        .get("/realestate")
        .then((res) => res.json())
        .then((data) => {
          // Sort by creation date (newest first) and take only 3
          const newest = [...data]
            .sort(
              (a: Property, b: Property) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 3);
          setNewProperties(newest);
          setLoading((prev) => ({ ...prev, properties: false }));
        })
        .catch((err) => {
          console.error("Error fetching properties:", err);
          setLoading((prev) => ({ ...prev, properties: false }));
        });
    }
  , []);

  const features = [
    {
      title: "Property Simulator",
      description: "Analyze potential investments and calculate ROI ",
      icon: <SquareTerminal size={30} />,
      link: "/platform/client/simulator",
      color: "white",
      image:"/assets/images/display/imageI.png"
    },
    {
      title: "Marketplace",
      description:
        "Browse exclusive property listings and investment opportunities",
      icon: <Store size={30} />,
      link: "/platform/client/market",
      color: "white",
      image:"/assets/images/display/imageC.png"

    },
    {
      title: "Ai Assistant",
      description: "Get help from our Ai agent for any questions or concerns",
      icon: <LifeBuoy size={30} />,
      link: "/platform/client/chat",
      color: "white",
      image:"/assets/images/display/imageC.png"

    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
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
        >
          Get Started
        </motion.h2>
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
            <Link key={index} href={feature.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ transition: { duration: 0.2 } }}
              >
                <Card
                  className={`overflow-hidden aspect-video bg-neutral-100 cursor-pointer  relative transition-all p-6 hover:shadow-md ${feature.color}`}
                >
                  <div className={` z-[1] w-full h-full absolute left-14 broder shadow-2xl shadow-black rounded-md top-14`} style={{background:`url(${feature.image})`,backgroundSize:"contain",backgroundRepeat:"no-repeat"}}></div>
                  <div className={`bg-gradient-to-t from-black to-[60%] to-transparent z-[2] w-full h-full absolute left-0 top-0`}></div>
                  <div className="relative z-[3] text-black "></div>
                  <div className="flex relative z-10 w-full items-end justify-between">

                  <div className="flex flex-col text-white z-[3] relative gap-2">
                    <div className="flex-1">
                      <h1 className="text-2xl font-[Rubik] font-black">
                        {feature.title}
                      </h1>
                      <p className="text-sm text-nowrap text-ellipsis overflow-hidden ">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="relative text-white w-fit">
                    <ChevronsRightIcon />
                  </div>

                  </div>
                </Card>
              </motion.div>
            </Link>
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
          {upcomingMeetings.length > 0 && (
            <div>
              <motion.h2
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Upcoming Meetings
              </motion.h2>
              <motion.p
                className="text-gray-500 mt-0 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Your scheduled consultations with real estate experts
              </motion.p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {loading.meetings ? (
            <div className="col-span-3 flex justify-center items-center h-40">
              <Loader2 className="animate-spin"></Loader2>
            </div>
          ) : (
            upcomingMeetings.length > 0 &&
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
                    <CardTitle className="text-lg">{meeting.topic}</CardTitle>
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
                    <Link
                      href={`/platform/client/meetings/${meeting.id}`}
                      className="w-full"
                    >
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
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
          {newProperties.length > 0 && (
            <div>
              <motion.h2
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                New Real Estate Listings
              </motion.h2>
              <motion.p
                className="text-gray-500 mt-0 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Recently added properties to our marketplace
              </motion.p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {loading.properties ? (
            <div className="col-span-3 flex justify-center items-center h-40">
              <Loader2 className="animate-spin"></Loader2>
            </div>
          ) : (
            newProperties.length > 0 &&
            newProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ transition: { duration: 0.2 } }}
              >
                <Link
                  href={`/client/property/${property.id}`}
                  className="block"
                >
                  <Card className="overflow-hidden transition-all hover:shadow-none cursor-pointer border-none shadow-none h-full rounded-none">
                    <div className="relative aspect-[1/.6] w-full rounded-md overflow-hidden">
                      <img
                        src={property.images[0] || "/placeholder-property.jpg"}
                        alt={property.title}
                        className="w-full h-full rounded-lg object-cover  transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/600 to-transparent h-16"></div>
                      <div className="absolute bottom-1 left-2 text-white px-3 py-1 rounded-full flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1 text-sm bg-[#ffffff50] border border-[#ffffff70] px-3 py-1 rounded-full backdrop-blur-sm">
                          <Bed size={14} />
                          {property.details.bedrooms}{" "}
                          {property.details.bedrooms === 1 ? "bed" : "beds"}
                        </span>
                        <span className="flex items-center gap-1 text-sm bg-[#ffffff50] border border-[#ffffff70] px-3 py-1 rounded-full backdrop-blur-sm">
                          <Bath size={14} />
                          {property.details.bathrooms}{" "}
                          {property.details.bathrooms === 1 ? "bath" : "baths"}
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
                        <Heart
                          size={18}
                          className="text-black hover:text-red-500 transition-colors"
                        />
                      </button>
                    </div>

                    <div className="pt-4 pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {property.title}
                          </h3>
                          <p className="flex items-center gap-1 text-gray-600 text-sm">
                            <MapPin size={14} />
                            {property.details.location}
                          </p>
                        </div>
                        <div className="font-semibold text-lg flex flex-col justify-end items-end">
                          {property.details.price}{" "}
                          <span className="text-sm font-normal text-gray-500">
                            Price
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

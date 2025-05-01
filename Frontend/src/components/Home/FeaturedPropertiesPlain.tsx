/* eslint-disable @typescript-eslint/no-explicit-any */
import useFetch from "@/lib/fetch"
import { motion } from "framer-motion"
import { Bed, Bath, Home, Heart, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { Card } from "../ui/card"

export default function FeaturedPropertiesPlain() {
  const [Data, setData] = useState([])
  useEffect(() => {
    useFetch.get("/realestate").then(res => res.json()).then((res) => {
      setData(res)
    })
  },[])
  function sqFtToSqM(area: any): import("react").ReactNode {
    return Math.floor(area / 10.764);
  }

 return <div className="flex flex-col sm:flex-row px-3 sm:px-0 gap-5 sm:h-96 justify-center">
  { Data.slice(0,3).map((property, index) => (
          <motion.div
            key={(property as any).id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * (index % 3) }}
          >
            <Card
              className="overflow-hidden aspect-[1/.8] transition-all hover:shadow-none cursor-pointer border-none shadow-none h-full rounded-none"
            >
              <div className="relative w-full rounded-md overflow-hidden">
                <img
                  src={(property as any).details.images[0]}
                  alt={(property as any).title}
                  className="w-full h-full rounded-lg object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/600 to-transparent h-16"></div>
                <div className="absolute bottom-1 left-2 text-white px-3 py-1 rounded-full flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1 text-sm bg-[#ffffff50] border border-[#ffffff70] px-3 py-1 rounded-full backdrop-blur-sm">
                    <Bed size={14} className="" />
                    {(property as any).details.bedrooms}{" "}
                    {(property as any).details.bedrooms === 1 ? "bed" : "beds"}
                  </span>
                  <span className="flex items-center gap-1 text-sm bg-[#ffffff50] border border-[#ffffff70] px-3 py-1 rounded-full backdrop-blur-sm">
                    <Bath size={14} className="" />
                    {(property as any).details.bathrooms}{" "}
                    {(property as any).details.bathrooms === 1 ? "bath" : "baths"}
                  </span>
                  <span className="flex items-center gap-1 text-sm bg-[#ffffff50] border border-[#ffffff70] px-3 py-1 rounded-full backdrop-blur-sm">
                    <Home size={14} className="" />
                    {sqFtToSqM((property as any).details.area)} m²
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
                    <h3 className="text-lg font-semibold">{(property as any).title}</h3>
                    <p className="flex  items-center gap-1 text-gray-600 text-sm">
                      <MapPin size={14} className="min-w-5" />
                      <span className="text-nowrap text-ellipsis overflow-hidden ">
                        {(property as any).details.location}
                      </span>
                    </p>
                  </div>
                  <div className="font-semibold text-lg flex flex-col justify-end items-end">
                    ${(property as any).details.price.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      Price
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
 </div>
}
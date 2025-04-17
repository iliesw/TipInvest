/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Bookmark, Search } from "lucide-react";
import LayoutC from "../layout";
import useFetch from "@/lib/fetch";

interface Expert {
  availability: any;
  createdAt: string;
  profilePicture: string | undefined;
  user: any;
  id: string;
  name: string;
  specialization: string;
  bio: string;
  hourlyRate: number;
  rating: number;
}

export default function ExpertsList() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await useFetch.get("/client/experts");
        if (!response.ok) {
          throw new Error("Failed to fetch experts");
        }
        const data = await response.json();
        setExperts(data.experts);
        setFilteredExperts(data.experts);
      } catch (error) {
        console.error("Error fetching experts:", error);
        // Keep the loading state false even on error to show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...experts];

    // Apply specialization filter
    if (specializationFilter !== "all") {
      result = result.filter(
        (expert) => expert.specialization === specializationFilter
      );
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (expert) =>
          expert.name.toLowerCase().includes(term) ||
          expert.specialization.toLowerCase().includes(term) ||
          expert.bio.toLowerCase().includes(term)
      );
    }

    setFilteredExperts(result);
  }, [experts, specializationFilter, searchTerm]);

  // Get unique specializations for filter dropdown
  const specializations = [
    "all",
    ...new Set(experts.map((expert) => expert.specialization)),
  ];

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const avalabiliti = (e:{}) => {
    const today = new Date().getDay()
    const keys = Object.keys(e)
    const DayToday = keys[today]
    const hour = new Date().getHours()
    if (hour > 23 || hour < 6){
      return false
    }
    // @ts-ignore
    return e[DayToday][hour-6]
  }

  const fulltime = (e: { (availability: any): unknown;[x: string]: boolean[]; }) => {
    const today = new Date().getDay()
    const keys = Object.keys(e)
    const DayToday = keys[today]
    // @ts-ignore
    const l:Array<boolean> = e[DayToday]

    return !l.includes(false)
  }

  return (
    <LayoutC>
      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Expert Consultations</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search experts..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
            >
              <option value="all">All Specializations</option>
              {specializations
                .filter((s) => s !== "all")
                .map((specialization) => (
                  <option key={specialization} value={specialization}>
                    {specialization}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredExperts.length > 0 ? (
          <div className="flex gap-4 flex-wrap">
            {filteredExperts.map((expert) => (
              <Card
                key={expert.id}
                className="p-6 relative w-[450px] flex rounded-3xl shadow-lg flex-col h-full"
                
              >
                <div className="w-full flex justify-between">
                  <img
                    src={expert.profilePicture || "/assets/images/1077114.png"}
                    className="w-16 aspect-square rounded-full border object-cover"
                  />
                  <div className="flex gap-2 flex-col items-end">
                    <button className="border h-fit flex items-center gap-2 px-2 py-1 rounded-sm text-sm">
                      <Bookmark size={16} /> Save
                    </button>
                    <p className="text-[12px] opacity-65">Joined {new Date(expert.createdAt).getFullYear()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-black opacity-70">@ {expert.user.name}</h2>
                  <h1 className="text-2xl font-[Rubik] font-extrabold ">{expert.specialization}</h1>
                  <div className="tags flex flex-wrap gap-2 mt-2">
                    {fulltime(expert.availability) === true && (
                      <div className="text-[12px] bg-blue-100 transition-all hover:shadow-blue-500 hover:shadow-xl text-blue-800 py-1 px-2.5 rounded-full border border-blue-200">Full Time</div>
                    )}
                    {avalabiliti(expert.availability) === true ? (
                      <div className="text-[12px] bg-green-100 transition-all hover:shadow-green-500 hover:shadow-xl text-green-800 py-1 px-2.5 rounded-full border border-green-200">Available Now</div>
                    ) : (
                      <div className="text-[12px] bg-gray-100 transition-all hover:shadow-gray-500 hover:shadow-xl text-gray-500 py-1 px-2.5 rounded-full border border-gray-200">Unabailable</div>
                    )}
                    
                  </div>
                </div>

                <div className="border-t-2 mt-12 pt-4 flex justify-between items-center">
                  <div className="flex flex-col">
                    <h2 className="font-black font-[Rubik]">${expert.hourlyRate}</h2>
                    <p className="text-[12px] opacity-40">0 Reviews</p>
                  </div>
                  <button className="bg-black text-sm text-white h-fit px-3 py-1.5 rounded-sm" onClick={(e) => {
                  e.preventDefault();
                  // Use window.location for client-side navigation
                  window.location.href = `/client/experts/${expert.id}`;
                }}>Book Now</button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500">
              No experts found matching your criteria.
            </p>
          </Card>
        )}
      </div>
    </LayoutC>
  );
}

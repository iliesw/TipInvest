/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Search } from "lucide-react";
import LayoutC from "../layout";
import useFetch from "@/lib/fetch";

interface Expert {
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
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <Card key={expert.id} className="p-6 flex flex-col h-full">
                <h3 className="text-2xl mb-2 font-[Milk] font-bold">{expert.user.name}</h3>
                <p className="text-black">{expert.specialization}</p>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-gray-700">
                    <span className="font-bold">{expert.hourlyRate}€</span> /
                    hour
                  </div>

                  <a
                    href={`/client/experts/${expert.id}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors inline-flex items-center"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </a>
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

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"
/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  Star,
  Video,
  User,
  Building2,
  Loader2,
  Check,
} from "lucide-react";
import { decodeToken } from "@/lib/auth";
import useFetch from "@/lib/fetch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ReviewsSection from "./ReviewsSection";

interface Review {
  id: string;
  clientID: string;
  expertID: string;
  comment: string;
  rating: number;
  date: string;
  clientName?: string;
}

interface Expert {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  reviews: Review[];
  completedMeetingsCount?: number;
  availability: {
    monday: boolean[];
    tuesday: boolean[];
    wednesday: boolean[];
    thursday: boolean[];
    friday: boolean[];
    saturday: boolean[];
    sunday: boolean[];
  };
}



export default function ExpertDetail() {
  const router = usePathname();
  const id = router.split("/").pop();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Booking form state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(30); // Default 30 minutes
  const [topic, setTopic] = useState("");
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    fetchExpertData();
    const token = localStorage.getItem("TOKENAUTH");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.id) {
        setUserId(decoded.id);
      }
    }
  },[]);

  const fetchExpertData = async () => {
    if (!id) return;
    try {
      const response = await useFetch.get(`/client/experts/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch expert data");
      }

      const data = await response.json();
      if (!data.expert) {
        throw new Error("Expert not found");
      }

      setExpert(data.expert);
    } catch (error) {
      console.error("Error fetching expert data:", error);
      setExpert(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (hour: number) => {
    setSelectedTime(hour);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedDate ||
      selectedTime === null ||
      !topic ||
      !userId ||
      !expert
    ) {
      setBookingStatus("error");
      setBookingMessage("Please fill in all required fields");
      return;
    }

    setBookingStatus("loading");

    try {
      const meetingDate = new Date(selectedDate);
      meetingDate.setHours(selectedTime, 0, 0, 0);

      const bookingData = {
        expertId: expert.id,
        clientId: userId,
        scheduledTime: meetingDate.toISOString(),
        duration,
        topic,
        status: "scheduled",
      };

      const response = await useFetch.post("/client/meetings", bookingData);
      if (!response.ok) {
        throw new Error("Failed to book meeting");
      }

      const data = await response.json();
      if (!data.meeting) {
        throw new Error("Failed to create meeting");
      }

      setBookingStatus("success");
      setBookingMessage("Your meeting has been successfully scheduled!");

      // Reset form
      setSelectedDate(null);
      setSelectedTime(null);
      setTopic("");
    } catch (error) {
      console.error("Error booking meeting:", error);
      setBookingStatus("error");
      setBookingMessage(
        error instanceof Error
          ? error.message
          : "Failed to book meeting. Please try again."
      );
    }
  };

  const getAvailableHours = () => {
    if (!selectedDate || !expert) return [];

    const dayOfWeek = selectedDate.getDay();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = dayNames[dayOfWeek] as keyof typeof expert.availability;

    return expert.availability[dayName]
      .map((available, hour) => (available ? hour : null))
      .filter((hour): hour is number => hour !== null);
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <>
      <div className="space-y-6 w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin" />
          </div>
        ) : expert ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Expert Profile */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{expert.name}</h2>
                    <h1 className="text-3xl font-[Rubik] font-black flex items-center gap-2">
                      <Building2 /> {expert.specialization}
                    </h1>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="font-medium text-yellow-600">
                        {expert.rating || "-"}
                      </span>
                    </div>

                    <div className="flex items-center bg-green-50 px-3 py-1 rounded-full mt-2">
                      <Check className="h-5 w-5 text-green-500 mr-1" />
                      <span className="font-medium text-green-600">
                        {expert.completedMeetingsCount || 0} completed sessions
                      </span>
                    </div>

                    <div className="flex items-center mt-2">
                      <span className="text-gray-700">
                        <span className="font-black text-lg">
                          $ {expert.hourlyRate} / hr
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{expert.bio}</p>

                <div>
                  <h2 className="text-xl font-semibold mb-2">How It Works</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-medium">1. Book</h3>
                      <p className="text-sm text-gray-600">
                        Select a date and time for your consultation
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                        <User className="h-5 w-5 text-amber-600" />
                      </div>
                      <h3 className="font-medium">2. Confirm</h3>
                      <p className="text-sm text-gray-600">
                        Receive confirmation and meeting details
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="bg-lime-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                        <Video className="h-5 w-5 text-lime-600" />
                      </div>
                      <h3 className="font-medium">3. Connect</h3>
                      <p className="text-sm text-gray-600">
                        Join the video call at the scheduled time
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Booking Form */}
            <div>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Book a Consultation
                </h2>

                {bookingStatus === "success" ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          {bookingMessage}
                        </p>
                        <div className="mt-4">
                          <Link
                            href="/platform/client/meetings"
                            className="text-sm font-medium text-green-600 hover:text-green-500"
                          >
                            View your scheduled meetings
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBooking}>
                    {bookingStatus === "error" && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-red-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">
                              {bookingMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              id="date"
                              className={cn(
                                "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                "text-left font-normal",
                                !selectedDate && "text-gray-500"
                              )}
                            >
                              <div className="flex items-center">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? (
                                  format(selectedDate, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </div>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate || undefined}
                              onSelect={(date: Date | undefined) =>
                                date && handleDateSelect(date)
                                
                              }
                              disabled={{
                                before: new Date(),
                                after: new Date(
                                  Date.now() + 13 * 24 * 60 * 60 * 1000
                                ),
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {selectedDate && (
                          <div className="grid grid-cols-3 gap-2">
                            {getAvailableHours().length > 0 ? (
                              getAvailableHours().map((hour) => (
                                <button
                                  key={hour}
                                  type="button"
                                  className={`py-2 px-3 text-sm rounded-md ${
                                    selectedTime === hour
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-100 hover:bg-gray-200"
                                  }`}
                                  onClick={() => handleTimeSelect(hour)}
                                >
                                  {formatHour(hour)}
                                </button>
                              ))
                            ) : (
                              <p className="col-span-3 text-sm text-gray-500">
                                No available times on this date
                              </p>
                            )}
                          </div>
                      )}

                        <select
                          id="duration"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={duration}
                          onChange={(e) =>
                            setDuration(parseInt(e.target.value))
                          }
                          required
                        >
                          <option value="30">30 minutes</option>
                          <option value="45">45 minutes</option>
                          <option value="60">60 minutes</option>
                        </select>


                        <textarea
                          id="topic"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Briefly describe what you'd like to discuss"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          required
                        />

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={bookingStatus === "loading"}
                          className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-neutral-700 transition-colors disabled:bg-blue-300"
                        >
                          {bookingStatus === "loading"
                            ? "Booking..."
                            : "Book Consultation"}
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 text-center mt-2">
                        Estimated cost:{" "}
                        <span className="font-bold">
                          {expert.hourlyRate * (duration / 60)}€
                        </span>
                      </p>
                    </div>
                  </form>
                )}
              </Card>
            </div>
            {expert && <ReviewsSection expertId={expert.id} />}
          </div>
          
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500">Expert not found.</p>
            <Link
              href="/platform/client/experts"
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Back to Experts
            </Link>
          </Card>
        )}
      </div>
    </>
  );
}

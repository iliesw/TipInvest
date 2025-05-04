"use client";

import JitsiMeet from "./Jeet"; 
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Rating from '@mui/material/Rating';
import useFetch from "@/lib/fetch";
import { Loader2 } from "lucide-react";
export default function MeetingRoom() {
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.split("/").pop();
  const [expert, setExpert] = useState("Expet");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  useEffect(() => {
    // Fetch the expert's name based on the room ID
    // Replace this with your own logic to fetch the expert's name
    const fetchedExpert = "John Doe";
    setExpert(fetchedExpert);
  }, [id]);

  const submitReview = () => {
    setLoading(true);
   useFetch.post('/client/meetings/rate',{
    id:id,
    rating:rating,
    review:review
   }).then(res=>{
    return res.json()
   }).then(res=>{
    if(res.status){
      setLoading(false);
      setShowThankYou(true);
      // Redirect after showing thank you message
      setTimeout(() => {
        router.push(`/platform/client`);
      }, 3000);
    }
   })
  };

  const [mode, setMode] = useState(true);

  return (
    <div className="relative w-full h-full">
      <div
        className={`w-full flex flex-col items-center justify-center transition-all duration-[2s] h-full bg-white absolute top-0 left-0 ${
          mode ? "opacity-0" : "opacity-100"
        }`}
      >
        {showThankYou ? (
          <div className="flex flex-col items-center justify-center text-lg w-96 p-8 border shadow-xl rounded-2xl ">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-[pulse_2s_infinite]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Thank You!</h1>
            <p className="text-center text-gray-600 mb-4">Your feedback for {expert} has been submitted successfully.</p>
            <p className="text-center text-sm text-gray-500">Redirecting you to dashboard...</p>
          </div>
        ) : (
          <div className="flex flex-col text-lg w-96 p-8 border shadow-xl rounded-2xl">

        <h1 className="text-xl">Give {expert} a Review</h1>
        <p className="text-sm mb-4 opacity-65">How would you rate the experience</p>
        <Rating  size="large" onChange={(e,c)=>{setRating(c as number)}}/>
        <p className="mt-4 text-sm opacity-65">Write him feedback</p>
        <textarea name="" className="border text-sm border-black/10 p-4 rounded-md mt-2 resize-none h-48" placeholder="Leave Your Review Here" id="" onChange={e=>{
          setReview(e.target.value)
        }}></textarea>
        <button onClick={submitReview} className="bg-black w-full mt-2 rounded-md py-2 text-white text-sm">{
          loading? <Loader2 className="animate-spin"/> : "Submit Review"
}</button>
        </div>
        )}
      </div>

      <div
        className={`w-full h-full rounded-sm overflow-hidden relative ${
          mode ? "" : "hidden"
        }`}
      >
        <JitsiMeet
          roomName={`vpaas-magic-cookie-6697529711ce43fea3f6664db554d3f1/${id}`}
          setter={setMode}
          />
      </div>
    </div>
  );
}

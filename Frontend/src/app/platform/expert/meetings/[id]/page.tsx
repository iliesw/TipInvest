"use client"
import JitsiMeet from "./Jeet";
import { usePathname } from "next/navigation";

export default function MeetingRoom() {
  const router = usePathname();
  const id = router.split("/").pop();

  return (
    <div className="w-full h-full rounded-sm overflow-hidden">
     <JitsiMeet roomName={`vpaas-magic-cookie-6697529711ce43fea3f6664db554d3f1/${id}`} setter={()=>{}}/>
    </div>
  );
}

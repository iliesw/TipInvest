"use client";
import { Play } from "lucide-react"
import { useState, useRef } from "react"

export const Vid = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const vidstr = "/assets/vid.mp4"

    const handlePlayClick = () => {
        if (videoRef.current) {
            try {
                if (!isPlaying) {
                    const playPromise = videoRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error("Error playing video:", error);
                        });
                    }
                } else {
                    videoRef.current.pause();
                }
                setIsPlaying(!isPlaying);
            } catch (error) {
                console.error("Error handling video playback:", error);
            }
        }
    };

    return (
        <div className="aspect-video px-3 sm:p-0 w-full sm:w-2/3 rounded-xl mx-auto relative">
            <video
                ref={videoRef}
                src={vidstr}
                className="w-full h-full object-cover rounded-xl"
                poster="/assets/images/vidp.png"
                onLoadedMetadata={() => {
                    if (videoRef.current) {
                        videoRef.current.load();
                    }
                }}
                onError={(e) => console.error("Video error:", e)}
            />
            {!isPlaying && (
                <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    onClick={handlePlayClick}
                >
                    <div className="bg-lime-500 w-20 relative aspect-square rounded-full flex items-center justify-center cursor-pointer">
                        <div className="animate-ping absolute bg-lime-500 w-20 aspect-square rounded-full"></div>
                        <Play />
                    </div>
                </div>
            )}
        </div>
    )
}
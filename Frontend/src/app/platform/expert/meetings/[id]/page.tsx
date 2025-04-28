/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"
import Spinner from "@/components/Shared/ui/Spinner";
import { JaaSMeeting } from "@jitsi/react-sdk";
import useFetch from "@/lib/fetch";
import React ,{ useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function MeetingRoom() {
  const router = usePathname();
  const id = router.split("/").pop();
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  useEffect(() => {
    const T = localStorage.getItem("TOKENAUTH");
    useFetch
      .get("/user/me", {
        headers: {
          Authorization: `Bearer ${T}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUser({
          name: data.name,
          email: data.email,
        });
      });
  },[]);

  return (
    <div className="w-full h-full rounded-sm overflow-hidden">
      <JaaSMeeting
      
        appId={"vpaas-magic-cookie-50199e020f3b4042b6099437c379fd1b"}
        roomName={"Meeting#" + id}
        configOverwrite={{
          disableLocalVideoFlip: true,
          backgroundAlpha: 0.5,
        }}
        interfaceConfigOverwrite={{
          VIDEO_LAYOUT_FIT: "nocrop",
          MOBILE_APP_PROMO: false,
          TILE_VIEW_MAX_COLUMNS: 4,
        }}
        userInfo={{
          displayName: user.name,
          email: user.email,
        }}
        spinner={Spinner}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100%";
          iframeRef.style.width = "100%";
        }}
      />
    </div>
  );
}

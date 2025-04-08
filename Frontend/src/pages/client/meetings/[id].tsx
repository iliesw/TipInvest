import Spinner from "@/components/Shared/ui/Spinner";
import LayoutC from "../layout";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { useRouter } from "next/router";
import useFetch from "@/lib/fetch";
import { useEffect, useState } from "react";

export default function MeetingRoom() {
  const router = useRouter();
  const { id } = router.query;
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
  });

  return (
    <LayoutC>
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
    </LayoutC>
  );
}

"use client";

import * as React from "react";
import {
  Building,
  LayoutDashboard,
  MessageCircle,
  PlusCircle,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import LogoSM from "./Shared/LogoSM";
import { useEffect } from "react";
import useFetch from "@/lib/fetch";

const agencyNavItems = [
  {
    title: "Dashboard",
    url: "/agency",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Properties",
    url: "/agency/properties",
    icon: Building,
  },
  {
    title: "Add Property",
    url: "/agency/properties/add",
    icon: PlusCircle,
  },
  {
    title: "Real Estate Chat",
    url: "/client/chat",
    icon: MessageCircle,
  },
];


export function AgencySidebar() {
  const [user, setUser] = React.useState({
    name: "Agency Name",
    email: "agency@example.com"
  });

  useEffect(() => {
    const T = localStorage.getItem("TOKENAUTH");
    useFetch.get("/user/me", {
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
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }, []);
  
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <a href="#">
            <LogoSM />
            <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">TipInvest</span>
              <span className="truncate text-xs">Agency</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={agencyNavItems} />
        
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
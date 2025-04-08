"use client";
import useFetch from "@/lib/fetch";
import { useEffect } from "react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import {
  Calendar,
  Users,
  Home,
  LifeBuoy,
  Send,
} from "lucide-react";
import React from "react";
import LogoSM from "./Shared/LogoSM";


const data = {
  navMain: [
    {
        title: "Dashboard",
        url: "/expert",
        icon: Home,

      },
      {
        title: "Profile",
        url: "/expert/profile",
        icon: Users,
      },
      {
        title: "Meetings",
        url: "/expert/meetings",
        icon: Calendar,
      }
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [],
};
export function ExpertSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
  }, []);
  const [User, setUser] = React.useState({
    name: "John Doe",
    email: "john@example.com",
  });

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <LogoSM />
                <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TipInvest</span>
                  <span className="truncate text-xs">Expert</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={User} />
      </SidebarFooter>
    </Sidebar>
  );
}

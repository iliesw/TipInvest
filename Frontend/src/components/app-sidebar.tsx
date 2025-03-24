"use client";

import * as React from "react";
import {
  LifeBuoy,
  Send,
  SquareTerminal,
  Home,
  Store,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect } from "react";
import LogoSM from "./Shared/LogoSM";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/client",
      icon: Home,
      isActive: false,
    },
    {
      title: "Simulator",
      url: "/client/simulator",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Market Place",
      url: "/client/market",
      icon: Store,
    },
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
  projects: [

  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  useEffect(() => {
    const T = localStorage.getItem("TOKENAUTH");
    fetch("http://localhost:3001/user/me", {
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
                  <span className="truncate text-xs">Client</span>
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

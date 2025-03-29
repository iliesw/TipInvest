"use client";

import * as React from "react";
import {
  Building,
  // LayoutDashboard,
  // BarChart,
  // Users,
  // Settings,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import LogoSM from "./Shared/LogoSM";
import { useEffect } from "react";
import useFetch from "@/lib/fetch";

const adminNavItems = [
  // {
  //   title: "Dashboard",
  //   url: "/admin",
  //   icon: LayoutDashboard,
  //   isActive: true,
  // },
  {
    title: "Properties",
    url: "/admin/properties",
    icon: Building,
    isActive: true,
  },
  // {
  //   title: "Analytics",
  //   url: "/admin/analytics",
  //   icon: BarChart,
  // },
  // {
  //   title: "Users",
  //   url: "/admin/users",
  //   icon: Users,
  // },
  // {
  //   title: "Settings",
  //   url: "/admin/settings",
  //   icon: Settings,
  // },
];

export function AdminSidebar() {
  const [user, setUser] = React.useState({
    name: "John Doe",
    email: "test@gmail.com"
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
                  <span className="truncate text-xs">Admin</span>
                </div>
              </a>
            </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          
        </SidebarMenu>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
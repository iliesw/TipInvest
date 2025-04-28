"use client";

import * as React from "react";
import {
  SquareTerminal,
  Home,
  Store,
  MessageCircle,
  Headset,
  VideoIcon,
  PaintRoller,
  Building,
  LayoutDashboard,
  Users,
  Calendar,
  LucideIcon,
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Loader2,
  // ChartArea,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import LogoSM from "./LogoSM";
import useFetch, { Logout } from "@/lib/fetch";
import {
  Collapsible,
} from "@radix-ui/react-collapsible";
import { Avatar } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
const Data = {
  client: [
    {
      title: "Home",
      url: "/platform/client",
      icon: Home,
      isActive: false,
    },
    {
      title: "Simulator",
      url: "/platform/client/simulator",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Market Place",
      url: "/platform/client/market",
      icon: Store,
    },
    {
      title: "Real Estate Chat",
      url: "/platform/client/chat",
      icon: MessageCircle,
    },
    {
      title: "Decorator",
      url: "/platform/client/decorator",
      icon: PaintRoller,
    },
    {
      title: "Experts",
      url: "/platform/client/experts",
      icon: Headset,
    },
    {
      title: "Meetings",
      url: "/platform/client/meetings",
      icon: VideoIcon,
    },
  ],

  agency: [
    {
      title: "Dashboard",
      url: "/platform/agency",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Properties",
      url: "/platform/agency/properties",
      icon: Building,
    },
    
    {
      title: "Real Estate Chat",
      url: "/platform/agency/chat",
      icon: MessageCircle,
    },
  ],
  expert: [
    {
      title: "Dashboard",
      url: "/platform/expert",
      icon: Home,
    },
    {
      title: "Profile",
      url: "/platform/expert/profile",
      icon: Users,
    },
    {
      title: "Meetings",
      url: "/platform/expert/meetings",
      icon: Calendar,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/platform/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Properties",
      url: "/platform/admin/properties",
      icon: Building,
    },
    // {
    //   title: "Analytics",
    //   url: "/platform/admin/analytics",
    //   icon: ChartArea,
    // },
  ],
  default: [],
};

const GetItems = (type: string) => {
  switch (type) {
    case "admin":
      return Data.admin;
    case "client":
      return Data.client;
    case "expert":
      return Data.expert;
    case "agency":
      return Data.agency;
    default:
      return Data.default;
  }
};

export function AppSidebar() {
  const [type,setType] = useState("")
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
        setType(data.role)
      });
  }, []);
  const [User, setUser] = useState<{
    name: string;
    email: string;
  }>();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <LogoSM />
                <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TipInvest</span>
                  <span className="truncate text-xs">{type}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={GetItems(type)} />
      </SidebarContent>
      <SidebarFooter>
        {User != null ? (
          <NavUser user={User} />
        ) : (
          <div>
            <Loader2 className="animate-spin" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                <p className="flex text-sm gap-2">
                  <item.icon size={18}/>
                  <span>{item.title}</span>
                </p>
                </Link>
              </SidebarMenuButton>
              
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
  };
}) {
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar
                className="h-8 w-8 rounded-lg flex items-center justify-center bg-black text-white"
                style={{ borderRadius: "10px" }}
              >
                {user.name?.slice(0, 2).toLocaleUpperCase() || "??"}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] border shadow min-w-56 rounded-[10px] bg-white"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar
                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-black text-white"
                  style={{ borderRadius: "10px" }}
                >
                  {user.name?.slice(0, 2).toLocaleUpperCase() || "??"}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <Sparkles />
                Upgrade Plan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                Logout();
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

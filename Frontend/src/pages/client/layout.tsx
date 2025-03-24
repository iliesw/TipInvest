"use client";
import Layout from "@/components/layout";

import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";

export default function LayoutC({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const pathname = usePathname() || "";
  const path = pathname === "/client" ? "Home" : Cap(pathname.split("/").pop() || "Home");
  function Cap(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
  useEffect(() => {
    const token = localStorage.getItem("TOKENAUTH");
    if (token) {
      setIsAuthed(true);
    } else {
      router.push("/");
    }
  }, [router]);
  return (
    <>
      {isAuthed ? (
        <Layout>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-fit pt-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href={`${pathname}`}>{path}</BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
              <div className="p-4 w-full h-full flex flex-col items-start">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </Layout>
      ) : (
        <div />
      )}
    </>
  );
}

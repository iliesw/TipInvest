"use client";
import Layout from "@/components/layout";

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
import { ExpertSidebar } from "@/components/expert-sidebar";
import { requireExpert } from "@/lib/auth";

export default function ExpertLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const pathname = usePathname() || "";
  const path = pathname === "/expert" ? "Dashboard" : Cap(pathname.split("/").pop() || "Dashboard");
  
  function Cap(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
  
  useEffect(() => {
    // Use the requireExpert utility function to check if user is authenticated and has expert role
    if (requireExpert(router)) {
      setIsAuthed(true);
    }
  }, [router]);
  
  return (
    <>
      {isAuthed ? (
        <Layout>
          <SidebarProvider>
            <ExpertSidebar />
            <SidebarInset>
              <header className="flex h-fit pt-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/expert">Expert</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">{path}</BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
              <main className="flex-1 overflow-auto p-4 pr-8">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </Layout>
      ) : null}
    </>
  );
}
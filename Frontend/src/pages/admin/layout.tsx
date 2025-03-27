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
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const pathname = usePathname() || "";
  const path = pathname === "/admin" ? "Dashboard" : Cap(pathname.split("/").pop() || "Dashboard");
  
  function Cap(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
  
  useEffect(() => {
    const token = localStorage.getItem("TOKENAUTH");
    // In a real application, you would check if the token belongs to an admin user
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
            <AdminSidebar />
            <SidebarInset>
              <header className="flex h-fit pt-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
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
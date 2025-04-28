
import { AppSidebar } from "@/components/SideBar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-fit pt-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 pr-4">
            <Suspense
              fallback={
                <div className="flex items-center justify-center w-full h-full">
                  <Loader2 className="animate-spin" />
                </div>
              }
            >
              {children}
            </Suspense>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

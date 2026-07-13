import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-warm">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Floating trigger for mobile (sidebar is offcanvas there) */}
          <div className="md:hidden sticky top-0 z-30 flex items-center h-12 px-3 bg-background/80 backdrop-blur-xl border-b border-border/60">
            <SidebarTrigger className="text-foreground" />
          </div>

          <main className="flex-1 overflow-x-hidden">
            <div className="container max-w-6xl py-6 md:py-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

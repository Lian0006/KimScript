import SimpleSidebarFixed from "@/components/simple-sidebar-fixed";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <SimpleSidebarFixed />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}



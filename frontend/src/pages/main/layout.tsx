import { Outlet } from "react-router";
import Navigation from "@/components/Navigation";

export default function Layout() {
  return (
    <main className="flex-1  p-4">
      {/* Sticky navigation bar */}
      <div className="sticky top-0 z-10 ">
        <div className="w-full flex items-center justify-center py-4">
          <Navigation />
        </div>
      </div>
      <Outlet />
    </main>
  );
}

import { Outlet } from "react-router";
import Navigation from "@/components/Navigation";

export default function Layout() {
  return (
    <main className="flex-1 p-4">
      <div className="w-full flex items-center justify-center">
        {" "}
        <Navigation />
      </div>
      <Outlet />
    </main>
  );
}

import { Outlet, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Breadcrumb from "@/components/Breadcrumb";
export default function Layout() {
  const { pathname } = useLocation();
  const hiddenRoutes = ["/"];
  const hideBreadcrumb = hiddenRoutes.includes(pathname);
  return (
    <main className="flex-1  p-4">
      {/* Sticky navigation bar */}
      <div className="sticky top-0 z-10 ">
        <div className="w-full flex items-center justify-center py-4">
          <Navigation />
        </div>
      </div>
      {!hideBreadcrumb && <Breadcrumb />}
      <Outlet />
    </main>
  );
}

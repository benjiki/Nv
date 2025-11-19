import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb as BreadcrumbContainer,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => !/^\d+$/.test(seg)); // remove numeric IDs

  // Map segment keys to friendly names
  const segmentNameMap: Record<string, string> = {
    accountholders: "Account Holders",
    edit: "Edit",
    create: "Create",
  };

  return (
    <BreadcrumbContainer>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          const name = segmentNameMap[segment] || segment.replace(/-/g, " ");

          return (
            <div className="flex items-center" key={href}>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={href}>{name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
}

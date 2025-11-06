// frontend\src\PageGuards.tsx
import { Navigate, Outlet } from "react-router";
import { useAuth } from "./hooks/useAuth";
import Loader from "./components/Loader";

export function PrivateRoute() {
  const { data: user, isLoading, isError } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader color="#6F4E37" loading={true} />
      </div>
    );
  }
  if (isError || !user) return <Navigate to={"/auth"} />;

  return <Outlet />;
}

export function GuestRoute() {
  const { data: user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader color="#6F4E37" loading={true} />
      </div>
    );
  }

  return !user ? <Outlet /> : <Navigate to={"/"} />;
}

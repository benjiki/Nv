import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const { data: user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleLogout = () => {
    // Remove tokens from storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    queryClient.setQueryData(["auth"], null);
    // Optionally force reload to reset all queries
    navigate("/auth/login");
  };

  if (isLoading) return <div>Loading user...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      {user ? (
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            Welcome, {user.phoneNumber}
          </h1>
          <p className="text-gray-600">Role: {user.role}</p>

          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="text-gray-600">You are not logged in</p>
      )}
    </div>
  );
};

export default Home;

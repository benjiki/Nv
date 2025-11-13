import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const Logout = () => {
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
  return (
    <button onClick={handleLogout} className="">
      Logout
    </button>
  );
};

export default Logout;

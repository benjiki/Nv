// hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import { authService } from "../utils/authService";

export function useAuth() {
  return useQuery({
    queryKey: ["auth"],
    queryFn: authService.me,
    retry: false,
    // only fetch if token exists
    enabled: !!localStorage.getItem("accessToken"),
  });
}

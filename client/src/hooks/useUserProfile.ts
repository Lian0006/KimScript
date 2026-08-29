import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useAuth } from "./useAuth";

export interface UserProfile {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  subscriptionPlan: string;
  createdAt?: string;
}

export function useUserProfile() {
  const { isAuthenticated } = useAuth();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: isAuthenticated,
    queryFn: getQueryFn<UserProfile>({ on401: "returnNull" }),
    staleTime: 60 * 1000,
  });

  return {
    profile: profile ?? null,
    subscriptionPlan: (profile?.subscriptionPlan as "free" | "lite" | "creator" | "profesional") ?? "free",
    isLoading,
    error,
  };
}

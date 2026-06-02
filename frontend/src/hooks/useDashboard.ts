import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DashboardStats } from "@/types";

export function useDashboard() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard");
      return data;
    },
    refetchInterval: 60_000,
  });
}

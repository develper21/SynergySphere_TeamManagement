import { useQuery } from "@tanstack/react-query";
import { api, DashboardStats, Activity } from "@/lib/api";

// Get dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/stats");
      return data.data as DashboardStats;
    },
  });
};

// Get recent activities
export const useRecentActivities = () => {
  return useQuery({
    queryKey: ["dashboard", "activities"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/activities");
      return data.data as Activity[];
    },
  });
};

// Get weekly activity data
export const useWeeklyActivity = () => {
  return useQuery({
    queryKey: ["dashboard", "weekly-activity"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/weekly-activity");
      return data.data as Array<{ day: string; tasks: number; hours: number }>;
    },
  });
};

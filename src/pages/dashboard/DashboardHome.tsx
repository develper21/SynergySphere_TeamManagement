import { BarChart3, FolderKanban, CheckSquare, Users, TrendingUp, Clock, ArrowUpRight, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useDashboardStats, useRecentActivities, useWeeklyActivity } from "@/hooks/api/useDashboard";
import { formatDistanceToNow } from "date-fns";

const DashboardHome = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities();
  const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyActivity();

  const statCards = [
    { icon: FolderKanban, label: "Active Projects", value: stats?.activeProjects?.toString() || "0", change: "+2 this week", color: "text-primary" },
    { icon: CheckSquare, label: "Tasks Completed", value: stats?.tasksCompleted?.toString() || "0", change: "+12 today", color: "text-accent" },
    { icon: Users, label: "Team Members", value: stats?.teamMembers?.toString() || "0", change: "+3 this month", color: "text-secondary" },
    { icon: TrendingUp, label: "Productivity", value: `${stats?.productivity || 0}%`, change: "+5% vs last week", color: "text-info" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Good Morning! 👋</h1>
        <p className="text-muted-foreground font-medium">Here's what's happening with your projects today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <div className="col-span-4 flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          statCards.map((stat, i) => (
            <div key={i} className="clay-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="clay-card-inset w-11 h-11 flex items-center justify-center rounded-xl">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-accent" />
              </div>
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              <div className="text-xs text-accent font-bold mt-1">{stat.change}</div>
            </div>
          ))
        )}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="clay-card p-6">
          <h3 className="font-bold mb-4">Weekly Task Activity</h3>
          {weeklyLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "1rem",
                    boxShadow: "var(--clay-shadow-sm)",
                  }}
                />
                <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="clay-card p-6">
          <h3 className="font-bold mb-4">Working Hours</h3>
          {weeklyLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "1rem",
                    boxShadow: "var(--clay-shadow-sm)",
                  }}
                />
                <Line type="monotone" dataKey="hours" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ fill: "hsl(var(--secondary))", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="clay-card p-6">
        <h3 className="font-bold mb-4">Recent Activity</h3>
        {activitiesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !activities || activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="clay-card-inset p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="clay-card w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold text-primary">
                    {a.user[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      <span className="font-bold">{a.user}</span> {a.action}{" "}
                      {a.task && <span className="text-primary font-bold">"{a.task}"</span>}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">{a.project}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(a.time), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;

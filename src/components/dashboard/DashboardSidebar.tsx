import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users, Settings,
  Bell, FileText, User, CreditCard, Brain, LogOut, ChevronLeft, ChevronRight, MessageSquare
} from "lucide-react";
import { useState } from "react";
import { useLogout } from "@/hooks/api/useAuth";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FolderKanban, label: "Projects", path: "/dashboard/projects" },
  { icon: CheckSquare, label: "Tasks", path: "/dashboard/tasks" },
  { icon: Users, label: "Members", path: "/dashboard/members" },
  { icon: MessageSquare, label: "Discussions", path: "/dashboard/discussion" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: Brain, label: "AI Panel", path: "/dashboard/ai" },
  { icon: FileText, label: "Templates", path: "/dashboard/templates" },
  { icon: CreditCard, label: "Billing", path: "/dashboard/billing" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  { icon: User, label: "Profile", path: "/dashboard/profile" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const logout = useLogout();

  return (
    <aside className={cn(
      "clay-sidebar h-screen flex flex-col transition-all duration-300 border-r border-border/50 relative",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between">
        <Logo size="sm" showText={!collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="clay-card-inset w-8 h-8 flex items-center justify-center rounded-lg hover:scale-110 transition-transform"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all text-left"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

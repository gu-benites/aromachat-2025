"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Home,
  KanbanSquare,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  Search,
  Settings,
  Target,
  BellRing,
  Headphones,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  submenu?: boolean;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Search",
    href: "/search",
    icon: <Search className="h-5 w-5" />,
  },
  {
    title: "Reporting",
    href: "/reporting",
    icon: <BarChart3 className="h-5 w-5" />,
    submenu: true,
  },
  {
    title: "Check-ins",
    href: "/check-ins",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    title: "Objectives",
    href: "/objectives",
    icon: <Target className="h-5 w-5" />,
  },
  {
    title: "Career Hub",
    href: "/career-hub",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: <BellRing className="h-5 w-5" />,
    badge: 1,
  },
  {
    title: "Mail",
    href: "/mail",
    icon: <Mail className="h-5 w-5" />,
    submenu: true,
  },
  {
    title: "Kanban",
    href: "/kanban",
    icon: <KanbanSquare className="h-5 w-5" />,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: <CheckCircle className="h-5 w-5" />,
    badge: 3,
  },
];

const userMenuItems: NavItem[] = [
  {
    title: "Documentation",
    href: "/docs",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Support",
    href: "/support",
    icon: <Headphones className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

function UserMenu({ collapsed }: { collapsed: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <div className="mt-auto border-t p-4">
      <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
        <div className="relative">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="text-sm font-medium">AT</span>
          </div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background"></span>
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 overflow-hidden">
              <div className="font-medium">Anna Taylor</div>
              <div className="truncate text-xs text-muted-foreground">
                anna.t@email.com
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </>
        )}
      </div>

      {!collapsed && expanded && (
        <div className="mt-4 space-y-1">
          {userMenuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
          <Separator className="my-2" />
          <Link
            href="/logout"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 font-semibold",
            collapsed && "justify-center"
          )}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <div className="h-4 w-4 rounded-sm bg-primary" />
          </div>
          {!collapsed && <span>Beyond UI</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                </div>
                {!collapsed && (
                  <div className="flex items-center">
                    {item.badge && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                    {item.submenu && <ChevronDown className="ml-2 h-4 w-4" />}
                  </div>
                )}
                {collapsed && item.badge && (
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {item.badge}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <UserMenu collapsed={collapsed} />
    </aside>
  );
}
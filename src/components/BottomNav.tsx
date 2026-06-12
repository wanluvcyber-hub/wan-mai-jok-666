import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BarChart3, PieChart, ListOrdered, Settings } from "lucide-react";

const items = [
  { to: "/", label: "สรุป", icon: Home },
  { to: "/analyze", label: "วิเคราะห์", icon: BarChart3 },
  { to: "/categories", label: "หมวด / งบ", icon: PieChart },
  { to: "/list", label: "รายการ", icon: ListOrdered },
  { to: "/settings", label: "ตั้งค่า", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-border/60 bg-card/95 backdrop-blur-md">
      <ul className="flex items-center justify-around px-2 pt-2 pb-3">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                <span className={`text-[11px] ${active ? "font-semibold" : ""}`}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

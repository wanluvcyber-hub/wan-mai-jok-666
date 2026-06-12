import { ChevronLeft, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function PageShell({ title, children, backTo = "/" }: { title: string; children: ReactNode; backTo?: string }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md pb-28">
        {/* Top bar mimicking LINE LIFF */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-background/85 px-4 py-3 backdrop-blur-md">
          <Link to={backTo} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
            <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <div className="text-center">
            <div className="font-display text-base font-semibold text-foreground">{title}</div>
            <div className="text-[11px] text-muted-foreground">app.wanjot.com</div>
          </div>
          <button className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
            <X className="h-6 w-6" strokeWidth={2.2} />
          </button>
        </header>

        <main className="space-y-4 px-4 pt-2">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}

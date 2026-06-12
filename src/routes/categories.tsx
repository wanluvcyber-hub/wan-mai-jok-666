import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { categories, fmtBahtShort } from "@/lib/mockData";
import { Calendar, Pencil, ListFilter, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "หมวด / งบ – Wanjot" },
      { name: "description", content: "จัดการหมวดหมู่รายรับรายจ่ายและตั้งงบประมาณรายเดือน" },
      { property: "og:title", content: "หมวด / งบ – Wanjot" },
      { property: "og:description", content: "จัดการหมวดและงบประมาณ" },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const [tab, setTab] = useState<"expense" | "income">("expense");
  const list = categories.filter((c) => c.type === tab);

  return (
    <PageShell title="จัดการหมวดและงบ">
      <h1 className="px-1 pt-2 text-center font-display text-3xl font-bold text-cocoa">จัดการหมวดและงบ</h1>

      {/* รอบตัดงบ */}
      <section className="paper-card flex items-center justify-between p-4">
        <div>
          <div className="font-semibold text-cocoa">รอบตัดงบ</div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            รายเดือน (วันที่ 1)
          </div>
        </div>
        <button className="flex items-center gap-1.5 rounded-2xl border border-border bg-background px-4 py-2 text-sm">
          <Pencil className="h-4 w-4" /> ตั้งค่า
        </button>
      </section>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setTab("expense")}
          className={`rounded-2xl border-2 py-3 font-display text-lg font-bold transition-all ${
            tab === "expense"
              ? "border-primary bg-pink-soft text-primary"
              : "border-transparent bg-card text-muted-foreground"
          }`}
        >
          รายจ่าย
        </button>
        <button
          onClick={() => setTab("income")}
          className={`rounded-2xl border-2 py-3 font-display text-lg font-bold transition-all ${
            tab === "income"
              ? "border-mint bg-mint-soft text-mint-foreground"
              : "border-transparent bg-card text-muted-foreground"
          }`}
        >
          รายรับ
        </button>
      </div>

      {/* Sort */}
      <div>
        <button className="flex items-center gap-1.5 rounded-2xl border border-border bg-card px-4 py-2 text-sm text-cocoa shadow-soft">
          <ListFilter className="h-4 w-4" /> จัดเรียง
        </button>
      </div>

      {/* List */}
      <ul className="space-y-3">
        {list.map((c) => {
          const hasBudget = c.budget != null;
          const remaining = hasBudget ? c.budget! - c.spent : null;
          const pct = hasBudget && c.budget! > 0 ? Math.min((c.spent / c.budget!) * 100, 100) : 0;
          const over = hasBudget && remaining! < 0;
          return (
            <li
              key={c.name}
              className="paper-card flex items-center gap-3 p-4 transition-transform active:scale-[0.99]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cream text-2xl">{c.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-cocoa">{c.name}</div>
                {hasBudget ? (
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${over ? "bg-destructive" : "bg-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                ) : (
                  <div className="mt-0.5 text-xs text-muted-foreground">ยังไม่ตั้งงบ</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-[11px] text-muted-foreground">งบ</div>
                <div className={`text-sm font-semibold ${hasBudget ? "text-cocoa" : "text-muted-foreground"}`}>
                  {hasBudget ? fmtBahtShort(c.budget!) : "ไม่มี"}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}

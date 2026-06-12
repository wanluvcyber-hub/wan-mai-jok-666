import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useTransactions } from "@/hooks/useTransactions";
import { useState, useMemo } from "react";
import { Calendar, Pencil, ListFilter, ChevronRight, Check, X, Loader } from "lucide-react";
import { fmtBahtShort } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";

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
  const { transactions, categories, loading } = useTransactions();
  const [tab, setTab] = useState<"expense" | "income">("expense");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState<string>("");

  const categorySpent = useMemo(() => {
    const map = new Map<string, number>();
    transactions.forEach((t) => {
      if (t.amount < 0) {
        const current = map.get(t.category_name) || 0;
        map.set(t.category_name, current + Math.abs(t.amount));
      }
    });
    return map;
  }, [transactions]);

  const list = categories.filter((c) => c.type === tab);

  const handleEditBudget = (name: string, currentBudget: number | null) => {
    setEditingCategory(name);
    setNewBudget(currentBudget?.toString() || "");
  };

  const handleSaveBudget = async (name: string) => {
    const budget = parseFloat(newBudget) || 0;
    const { error } = await supabase
      .from('categories')
      .update({ budget })
      .eq('name', name);

    if (error) {
      console.error('Error updating budget:', error);
    } else {
      setEditingCategory(null);
    }
  };

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
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader className="h-6 w-6 animate-spin text-cocoa-soft" />
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((c) => {
            const hasBudget = c.budget != null;
            const spent = categorySpent.get(c.name) || 0;
            const remaining = hasBudget ? c.budget! - spent : null;
            const pct = hasBudget && c.budget! > 0 ? Math.min((spent / c.budget!) * 100, 100) : 0;
            const over = hasBudget && remaining! < 0;
            const isEditing = editingCategory === c.name;

            return (
              <li
                key={c.name}
                className="paper-card flex items-center gap-3 p-4 transition-transform active:scale-[0.99]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cream text-2xl">{c.emoji || '💰'}</div>
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
                <div className="text-right min-w-[80px]">
                  <div className="text-[11px] text-muted-foreground">งบ</div>
                  {isEditing ? (
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        className="w-20 rounded border border-border bg-background px-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => handleSaveBudget(c.name)} className="text-mint-foreground">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => setEditingCategory(null)} className="text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className={`text-sm font-semibold cursor-pointer hover:text-primary transition-colors flex items-center justify-end gap-1 ${hasBudget ? "text-cocoa" : "text-muted-foreground"}`}
                      onClick={() => handleEditBudget(c.name, c.budget)}
                    >
                      {hasBudget ? fmtBahtShort(c.budget!) : "ไม่มี"}
                      <Pencil className="h-3 w-3 opacity-50" />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}

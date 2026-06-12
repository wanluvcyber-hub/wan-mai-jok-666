import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { fmtBaht, fmtBahtShort } from "@/lib/mockData";
import { Flame, ArrowLeftRight, ChevronDown, Plus, Loader } from "lucide-react";
import avatar from "@/assets/wanjot-avatar.jpg";
import { useTransactions } from "@/hooks/useTransactions";
import { useMemo, useState } from "react";
import { TransactionDialog } from "@/components/TransactionDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wanjot – บันทึกรายรับรายจ่าย" },
      { name: "description", content: "มินิแอปบนไลน์ บันทึกเงินเข้า-ออก เห็นภาพรวมไว ทำงานร่วมกับ Google Sheet" },
      { property: "og:title", content: "Wanjot – บันทึกรายรับรายจ่าย" },
      { property: "og:description", content: "บันทึกเงินเข้า-ออก เห็นภาพรวมไว ทำงานร่วมกับ Google Sheet" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { transactions, categories, loading, addTransaction } = useTransactions();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddTransaction = async (txn: any) => {
    await addTransaction(txn);
  };

  // Calculate income, expense, balance
  const income = useMemo(() => transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0), [transactions]);
  const expense = useMemo(() => transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0), [transactions]);
  const balance = useMemo(() => income - expense, [income, expense]);

  // Calculate expense by category
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

  // top expense categories for donut
  const expenseCats = useMemo(() => {
    return categories
      .filter((c) => c.type === "expense" && (categorySpent.get(c.name) || 0) > 0)
      .map((c) => ({ ...c, spent: categorySpent.get(c.name) || 0 }))
      .sort((a, b) => b.spent - a.spent);
  }, [categorySpent, categories]);

  const totalExp = useMemo(() => expenseCats.reduce((s, c) => s + c.spent, 0), [expenseCats]);

  // donut math
  const R = 64;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const palette = [
    "var(--primary)",
    "oklch(0.78 0.18 358)",
    "oklch(0.85 0.10 358)",
    "var(--pink-soft)",
    "oklch(0.72 0.06 280)",
    "oklch(0.85 0.04 250)",
    "var(--cream)",
  ];

  if (loading) {
    return (
      <PageShell title="สรุป" backTo="/">
        <div className="flex items-center justify-center p-8">
          <Loader className="h-6 w-6 animate-spin text-cocoa-soft" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="สรุป" backTo="/">
      {/* Profile card */}
      <section className="paper-card flex items-center gap-4 p-4">
        <div className="relative">
          <img src={avatar} alt="Wanjot avatar" className="h-16 w-16 rounded-full object-cover ring-2 ring-pink-soft" />
          <span className="absolute -bottom-1 -right-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground shadow">
            ฟรี
          </span>
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-cocoa">Wanjot</h1>
          <p className="text-xs text-muted-foreground">เด็กช่างฝัน · บันทึกเงินสนุกๆ</p>
        </div>
      </section>

      {/* Summary card */}
      <section className="paper-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold text-cocoa">สรุป</h2>
          <button className="flex items-center gap-1 text-sm text-muted-foreground">
            1 มิ.ย. – 30 มิ.ย. 2569
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Balance pill */}
        <div className="mb-3 rounded-2xl border border-border/70 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">เหลือเก็บ</span>
            <button className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
              รอบงบนี้ <ArrowLeftRight className="h-3 w-3" />
            </button>
          </div>
          <div className={`mt-1 font-display text-4xl font-bold ${balance < 0 ? "text-destructive" : "text-mint-foreground"}`}>
            {fmtBaht(balance)}
          </div>
        </div>

        {/* Income / Expense cards */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border-2 border-primary/40 bg-pink-soft/50 p-3">
            <div className="text-xs text-cocoa/70">รายจ่าย</div>
            <div className="font-display text-2xl font-bold text-primary">{fmtBaht(expense)}</div>
          </div>
          <div className="rounded-2xl border-2 border-mint/50 bg-mint-soft/60 p-3">
            <div className="text-xs text-cocoa/70">รายรับ</div>
            <div className="font-display text-2xl font-bold text-mint-foreground">{fmtBaht(income)}</div>
          </div>
        </div>

        {/* Donut + stats */}
        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
            <circle cx="80" cy="80" r={R} fill="none" stroke="var(--muted)" strokeWidth="18" />
            {expenseCats.map((c, i) => {
              const pct = c.spent / (totalExp || 1);
              const dash = pct * C;
              const el = (
                <circle
                  key={c.name}
                  cx="80"
                  cy="80"
                  r={R}
                  fill="none"
                  stroke={palette[i % palette.length]}
                  strokeWidth="18"
                  strokeDasharray={`${dash} ${C - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                />
              );
              offset += dash;
              return el;
            })}
          </svg>

          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                จดติดต่อมา <Flame className="h-4 w-4 text-primary" />
              </span>
              <span className="font-semibold text-cocoa">1 วัน</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">จำนวนรายการ</span>
              <span className="font-semibold text-cocoa">{transactions.length}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">งบที่ตั้งไว้</span>
              <span className="font-semibold text-cocoa">
                {fmtBahtShort(categories.filter(c => c.budget).reduce((s, c) => s + (c.budget ?? 0), 0))}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">งบคงเหลือ</span>
              <span className="font-semibold text-primary">
                {fmtBahtShort(categories.filter(c => c.budget).reduce((s, c) => s + (c.budget ?? 0) - (categorySpent.get(c.name) || 0), 0))}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">รอบงบ</span>
              <span className="font-semibold text-cocoa">รายเดือน</span>
            </li>
          </ul>
        </div>

        <button className="mt-5 flex w-full items-center justify-center gap-1 rounded-2xl border border-border bg-background py-3 text-sm text-cocoa">
          ดูเพิ่ม <ChevronDown className="h-4 w-4" />
        </button>
      </section>

      {/* Top categories preview */}
      <section className="paper-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-cocoa">หมวดที่ใช้มากสุด</h3>
          <Link to="/categories" className="text-xs font-medium text-primary">ดูทั้งหมด →</Link>
        </div>
        <ul className="space-y-3">
          {expenseCats.slice(0, 4).map((c, i) => {
            const pct = totalExp ? (c.spent / totalExp) * 100 : 0;
            const ofBudget = c.budget ? Math.min((c.spent / c.budget) * 100, 100) : null;
            return (
              <li key={c.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-cocoa">
                    <span className="text-lg">{c.emoji || '💰'}</span>
                    <span className="font-medium">{c.name}</span>
                  </span>
                  <span className="font-semibold text-primary">{fmtBahtShort(-c.spent)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${ofBudget ?? pct}%`,
                      background: palette[i % palette.length] as string,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Floating add button */}
      <button
        onClick={() => setDialogOpen(true)}
        aria-label="เพิ่มรายการ"
        className="fixed bottom-24 right-5 z-30 rounded-full bg-primary p-4 text-primary-foreground shadow-pop transition-transform active:scale-95"
      >
        <Plus className="h-6 w-6" strokeWidth={2.6} />
      </button>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        onSubmit={handleAddTransaction}
      />
    </PageShell>
  );
}

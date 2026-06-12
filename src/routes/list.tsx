import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { fmtBahtShort, thaiDate } from "@/lib/mockData";
import { Calendar, Download, ListChecks, RefreshCcw, Plus, ChevronRight, Trash2, Edit2, Loader } from "lucide-react";
import { useMemo, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionDialog } from "@/components/TransactionDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/list")({
  head: () => ({ meta: [{ title: "รายการ – Wanjot" }, { name: "description", content: "รายการรายรับรายจ่ายทั้งหมด" }] }),
  component: ListPage,
});

function ListPage() {
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Date selection state
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const { transactions, categories, loading, deleteTransaction, addTransaction, updateTransaction } = useTransactions();

  const filtered = useMemo(() => {
    // Filter by date first
    const dateFiltered = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    if (filter === "all") return dateFiltered;
    
    const categoryMap = new Map(categories.map(c => [c.name, c]));
    return dateFiltered.filter((t) => {
      const cat = categoryMap.get(t.category_name);
      return cat && (filter === "expense" ? cat.type === "expense" : cat.type === "income");
    });
  }, [filter, transactions, categories, selectedMonth, selectedYear]);

  const monthNames = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  const years = [2024, 2025, 2026];

  const grouped = useMemo(() => {
    const m = new Map<string, typeof filtered>();
    for (const t of filtered) {
      const k = t.date;
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(t);
    }
    return [...m.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filtered]);

  const tabs: { id: typeof filter; label: string }[] = [
    { id: "all", label: "ทั้งหมด" },
    { id: "expense", label: "รายจ่าย" },
    { id: "income", label: "รายรับ" },
  ];

  const handleAddTransaction = async (txn: any) => {
    if (editingTxn) {
      await updateTransaction(editingTxn.id, txn);
      setEditingTxn(null);
    } else {
      await addTransaction(txn);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm) {
      await deleteTransaction(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const getCategoryEmoji = (categoryName: string) => {
    return categories.find(c => c.name === categoryName)?.emoji || '💰';
  };

  return (
    <PageShell title="รายการ">
      {loading && (
        <div className="flex items-center justify-center p-8 text-cocoa-soft">
          <Loader className="h-5 w-5 animate-spin mr-2" />
          กำลังโหลด...
        </div>
      )}

      <section className="paper-card p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            <Calendar className="h-5 w-5 text-cocoa-soft" />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent font-display font-semibold text-cocoa focus:outline-none"
            >
              {monthNames.map((name, i) => (
                <option key={name} value={i}>{name}</option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent font-display font-semibold text-cocoa focus:outline-none"
            >
              {years.map(y => (
                <option key={y} value={y}>{y + 543}</option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-cocoa-soft">
            <Download className="h-3 w-3" /> ส่งออก
          </button>
        </div>
      </section>

      <section className="paper-card flex items-center gap-3 p-4">
        <div className="flex-1">
          <div className="mb-2 font-display text-base font-bold text-cocoa">คัดกรองประเภทรายการ</div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  filter === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-cocoa">
          <ListChecks className="h-4 w-4" /> เลือกหลายรายการ
        </button>
        <button className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-cocoa">
          <RefreshCcw className="h-4 w-4" /> ตั้งรายการจดประจำ
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader className="h-6 w-6 animate-spin text-cocoa-soft" />
        </div>
      ) : grouped.length === 0 ? (
        <div className="text-center py-8 text-cocoa-soft">
          <p>ไม่มีรายการ</p>
        </div>
      ) : (
        grouped.map(([date, items]) => {
          const sum = items.reduce((s, t) => s + t.amount, 0);
          return (
            <section key={date} className="space-y-2">
              <div className="flex items-center justify-between border-b border-border px-1 pb-1.5 text-sm">
                <span className="text-muted-foreground">{thaiDate(date)}</span>
                <span className={`font-semibold ${sum < 0 ? "text-primary" : "text-mint-foreground"}`}>
                  รวม: {fmtBahtShort(sum)}
                </span>
              </div>
              <ul className="space-y-2">
                {items.map((t) => (
                  <li key={t.id} className="paper-card flex items-center gap-3 p-3.5 group hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-cocoa">{t.title}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{t.time} น.</span>
                        <span className="rounded-md bg-muted px-1.5 py-0.5">{t.category_name}</span>
                      </div>
                    </div>
                    <div className={`font-display text-base font-bold ${t.amount < 0 ? "text-primary" : "text-mint-foreground"}`}>
                      {fmtBahtShort(t.amount)}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingTxn(t);
                          setDialogOpen(true);
                        }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="แก้ไข"
                      >
                        <Edit2 className="h-4 w-4 text-cocoa-soft" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(t.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}

      {/* Add button */}
      <button
        onClick={() => {
          setEditingTxn(null);
          setDialogOpen(true);
        }}
        aria-label="เพิ่มรายการ"
        className="fixed bottom-24 right-5 z-30 rounded-full bg-primary p-4 text-primary-foreground shadow-pop hover:shadow-lg transition-shadow"
      >
        <Plus className="h-6 w-6" strokeWidth={2.6} />
      </button>

      {/* Dialog */}
      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        onSubmit={handleAddTransaction}
        initialData={editingTxn}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>คุณแน่ใจที่จะลบรายการนี้หรือไม่ การกระทำนี้ไม่สามารถเลิกได้</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              ลบ
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}

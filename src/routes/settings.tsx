import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { FileSpreadsheet, Bell, Palette, Info, ChevronRight, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { setTheme, getTheme, Theme } from "@/lib/theme";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "ตั้งค่า – Wanjot" }, { name: "description", content: "ตั้งค่าและเชื่อม Google Sheet" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");

  useEffect(() => {
    setCurrentTheme(getTheme());
  }, []);

  const themes: { id: Theme; name: string; color: string }[] = [
    { id: "default", name: "ต้นฉบับ (ชมพู)", color: "bg-[#e91e63]" },
    { id: "blue", name: "ฟ้าสดใส", color: "bg-[#2196f3]" },
    { id: "green", name: "เขียวสบายตา", color: "bg-[#4caf50]" },
    { id: "orange", name: "ส้มอบอุ่น", color: "bg-[#ff9800]" },
    { id: "purple", name: "ม่วงละมุน", color: "bg-[#9c27b0]" },
  ];

  const handleThemeChange = (id: Theme) => {
    setTheme(id);
    setCurrentTheme(id);
    setThemeDialogOpen(false);
  };

  return (
    <PageShell title="ตั้งค่า">
      <h1 className="px-1 pt-6 text-center font-display text-3xl font-bold text-cocoa">ตั้งค่า</h1>

      <div className="mt-8 space-y-4">
        <section className="paper-card divide-y divide-border/70 overflow-hidden">
          <button className="flex w-full items-center gap-3 p-4 text-left transition-colors active:bg-muted">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cream"><FileSpreadsheet className="h-5 w-5 text-primary" /></div>
            <div className="flex-1">
              <div className="font-semibold text-cocoa">เชื่อม Google Sheet</div>
              <div className="text-xs text-muted-foreground">ดึงข้อมูลจากชีตของคุณ</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <button className="flex w-full items-center gap-3 p-4 text-left transition-colors active:bg-muted">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cream"><Bell className="h-5 w-5 text-primary" /></div>
            <div className="flex-1">
              <div className="font-semibold text-cocoa">การแจ้งเตือน</div>
              <div className="text-xs text-muted-foreground">เตือนเมื่อใกล้เกินงบ</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <button 
            onClick={() => setThemeDialogOpen(true)}
            className="flex w-full items-center gap-3 p-4 text-left transition-colors active:bg-muted"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cream"><Palette className="h-5 w-5 text-primary" /></div>
            <div className="flex-1">
              <div className="font-semibold text-cocoa">ธีมและสี</div>
              <div className="text-xs text-muted-foreground">ปรับแต่งหน้าตา: {themes.find(t => t.id === currentTheme)?.name}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </section>

        <section className="paper-card overflow-hidden">
          <button className="flex w-full items-center gap-3 p-4 text-left transition-colors active:bg-muted">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cream"><Info className="h-5 w-5 text-primary" /></div>
            <div className="flex-1">
              <div className="font-semibold text-cocoa">เกี่ยวกับ Wanjot</div>
              <div className="text-xs text-muted-foreground">เวอร์ชัน 0.1.0</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </section>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        ทำด้วย ❤️ สำหรับ LINE Mini App · มินิแอป Wanjot
      </p>

      <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
        <DialogContent className="max-w-[90vw] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-cocoa">เลือกธีมสี</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`flex items-center gap-3 rounded-2xl border p-3 transition-all ${
                  currentTheme === t.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                }`}
              >
                <div className={`h-8 w-8 rounded-full ${t.color}`} />
                <span className={`flex-1 text-left font-medium ${currentTheme === t.id ? "text-primary" : "text-cocoa"}`}>
                  {t.name}
                </span>
                {currentTheme === t.id && <Check className="h-5 w-5 text-primary" />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

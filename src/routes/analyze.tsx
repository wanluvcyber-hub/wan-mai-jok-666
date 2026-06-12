import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/analyze")({
  head: () => ({ meta: [{ title: "วิเคราะห์ – Wanjot" }, { name: "description", content: "วิเคราะห์รายรับรายจ่าย" }] }),
  component: () => (
    <PageShell title="วิเคราะห์">
      <div className="paper-card p-8 text-center">
        <div className="text-4xl">📊</div>
        <p className="mt-3 font-display text-lg text-cocoa">กำลังจะมาเร็วๆ นี้</p>
        <p className="mt-1 text-sm text-muted-foreground">หน้าวิเคราะห์กราฟรายเดือนสำหรับ Wanjot</p>
      </div>
    </PageShell>
  ),
});

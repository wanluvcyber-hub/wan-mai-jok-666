export type Txn = {
  id: string;
  date: string; // ISO
  title: string;
  category: string;
  amount: number; // negative = expense
  time: string;
};

export const profile = {
  name: "Wanjot",
  tagline: "บันทึกรายรับรายจ่าย ฉบับเด็กช่างฝัน",
  avatar: "🌸",
};

export const transactions: Txn[] = [
  { id: "1", date: "2025-06-09", title: "ค่าน้ำ", category: "ค่าน้ำค่าไฟ", amount: -240, time: "09:10" },
  { id: "2", date: "2025-06-07", title: "ค่ายิม", category: "สุขภาพ", amount: -350, time: "22:25" },
  { id: "3", date: "2025-06-07", title: "ขนมบ่าย", category: "อาหาร", amount: -85, time: "15:20" },
  { id: "4", date: "2025-06-07", title: "ซักผ้า", category: "เดินทาง", amount: -60, time: "14:55" },
  { id: "5", date: "2025-06-06", title: "เงินเดือน", category: "รายได้หลัก", amount: 15000, time: "08:00" },
  { id: "6", date: "2025-06-06", title: "กาแฟเช้า", category: "กาแฟ", amount: -65, time: "08:30" },
  { id: "7", date: "2025-06-05", title: "ค่าเน็ต", category: "ค่าเน็ต", amount: -599, time: "10:00" },
  { id: "8", date: "2025-06-04", title: "ที่พักทริป", category: "ที่พัก", amount: -1200, time: "16:40" },
  { id: "9", date: "2025-06-03", title: "ข้าวเที่ยง", category: "อาหาร", amount: -120, time: "12:15" },
  { id: "10", date: "2025-06-02", title: "ฟรีแลนซ์", category: "รายได้เสริม", amount: 3500, time: "21:00" },
];

export type Category = {
  name: string;
  budget: number | null;
  spent: number;
  emoji: string;
  type: "expense" | "income";
};

export const categories: Category[] = [
  { name: "อาหาร", budget: 3000, spent: 205, emoji: "🍜", type: "expense" },
  { name: "เดินทาง", budget: 1500, spent: 60, emoji: "🚌", type: "expense" },
  { name: "ที่พัก", budget: 2000, spent: 1200, emoji: "🏠", type: "expense" },
  { name: "ค่าโทรศัพท์", budget: 400, spent: 0, emoji: "📱", type: "expense" },
  { name: "ค่าเน็ต", budget: 700, spent: 599, emoji: "🌐", type: "expense" },
  { name: "กาแฟ", budget: 500, spent: 65, emoji: "☕", type: "expense" },
  { name: "ค่าน้ำค่าไฟ", budget: 800, spent: 240, emoji: "💡", type: "expense" },
  { name: "สุขภาพ", budget: null, spent: 350, emoji: "💪", type: "expense" },
  { name: "รายได้หลัก", budget: null, spent: 15000, emoji: "💼", type: "income" },
  { name: "รายได้เสริม", budget: null, spent: 3500, emoji: "✨", type: "income" },
];

export function fmtBaht(n: number) {
  const sign = n < 0 ? "-" : "";
  return `${sign}฿${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function fmtBahtShort(n: number) {
  const sign = n < 0 ? "-" : "";
  return `${sign}฿${Math.abs(n).toLocaleString("en-US")}`;
}

export function thaiDate(iso: string) {
  const d = new Date(iso);
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

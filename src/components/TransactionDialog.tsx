import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Txn, Category } from '@/hooks/useTransactions'

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  onSubmit: (txn: Omit<Txn, 'id'>) => Promise<void>
  initialData?: Txn | null
}

export function TransactionDialog({
  open,
  onOpenChange,
  categories,
  onSubmit,
  initialData,
}: TransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<Txn, 'id'>>(() => {
    if (initialData) {
      return {
        title: initialData.title,
        category_name: initialData.category_name,
        amount: initialData.amount,
        date: initialData.date,
        time: initialData.time,
      }
    }
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().slice(0, 5)
    return { title: '', category_name: '', amount: 0, date, time }
  })

  const selectedCategory = categories.find((c) => c.name === formData.category_name)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      const now = new Date()
      setFormData({
        title: '',
        category_name: '',
        amount: 0,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
      })
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">ชื่อรายการ</Label>
            <Input
              id="title"
              placeholder="เช่น ค่าน้ำ"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category_name">หมวดหมู่</Label>
            <Select value={formData.category_name} onValueChange={(val) => setFormData({ ...formData, category_name: val })}>
              <SelectTrigger id="category_name">
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.emoji || '💰'} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">จำนวนเงิน</Label>
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedCategory?.emoji || '💰'}</span>
              <div className="flex-1 flex items-center">
                <span className="text-sm text-cocoa-soft mr-2">{selectedCategory?.type === 'income' ? '+' : '-'}</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={Math.abs(formData.amount)}
                  onChange={(e) => {
                    const abs = Math.abs(Number(e.target.value))
                    const sign = selectedCategory?.type === 'income' ? 1 : -1
                    setFormData({ ...formData, amount: abs * sign })
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">วันที่</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">เวลา</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'กำลังบันทึก...' : initialData ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มรายการ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

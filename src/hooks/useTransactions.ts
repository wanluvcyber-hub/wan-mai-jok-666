import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type Txn = {
  id: string
  date: string // ISO YYYY-MM-DD
  time: string // HH:MM
  title: string
  category_name: string // Foreign key to categories.name
  amount: number // negative = expense, positive = income
}

export type Category = {
  name: string
  emoji: string | null
  budget: number | null
  type: 'expense' | 'income'
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Txn[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      console.log('Supabase: Fetched transactions successfully:', data?.length, 'rows')
      setTransactions(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching transactions')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  useEffect(() => {
    fetchTransactions()
    fetchCategories()

    // Subscribe to real-time changes for transactions
    const txnChannel = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
        },
        () => {
          fetchTransactions()
        }
      )
      .subscribe()

    // Subscribe to real-time changes for categories
    const catChannel = supabase
      .channel('categories_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
        },
        () => {
          fetchCategories()
        }
      )
      .subscribe()

    return () => {
      txnChannel.unsubscribe()
      catChannel.unsubscribe()
    }
  }, [])

  const addTransaction = async (txn: Omit<Txn, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([txn])
        .select()

      if (error) throw error
      await fetchTransactions()
      return data?.[0] || null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding transaction')
      console.error('Error:', err)
      return null
    }
  }

  const updateTransaction = async (id: string, updates: Partial<Txn>) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      await fetchTransactions()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating transaction')
      console.error('Error:', err)
      return false
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchTransactions()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting transaction')
      console.error('Error:', err)
      return false
    }
  }

  return {
    transactions,
    categories,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  }
}

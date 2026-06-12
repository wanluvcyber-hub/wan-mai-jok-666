import { supabase } from '@/lib/supabase'

// Example: Fetch data from a table
export async function fetchData(tableName: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')

  if (error) {
    console.error('Error fetching data:', error)
    return null
  }
  return data
}

// Example: Insert data
export async function insertData(tableName: string, payload: any) {
  const { data, error } = await supabase
    .from(tableName)
    .insert([payload])
    .select()

  if (error) {
    console.error('Error inserting data:', error)
    return null
  }
  return data
}

// Example: Update data
export async function updateData(tableName: string, id: string | number, updates: any) {
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating data:', error)
    return null
  }
  return data
}

// Example: Delete data
export async function deleteData(tableName: string, id: string | number) {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting data:', error)
    return false
  }
  return true
}

// Example: Real-time subscription
export function subscribeToTable(tableName: string, callback: (payload: any) => void) {
  return supabase
    .channel(`${tableName}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName,
      },
      callback
    )
    .subscribe()
}

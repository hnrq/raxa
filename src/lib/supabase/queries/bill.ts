import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

const billQuery = (supabase: SupabaseClient<Database>) =>
  supabase.from('bills').select(
    `
id,
title,
participants (id, name),
expenses (
  id,
  title,
  amount,
  paidBy:participants!expense_paid_by_fkey (id, name),
  participants!expenses_participants (id, name)
)
`
  );

export type BillQuery = QueryData<ReturnType<typeof billQuery>>;

export default billQuery;

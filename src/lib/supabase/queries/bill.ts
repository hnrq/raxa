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
  paidBy:participants!paid_by (id, name),
  participants:participants!id (id, name)
)
`
  );

export type BillQuery = QueryData<ReturnType<typeof billQuery>>;

export default billQuery;

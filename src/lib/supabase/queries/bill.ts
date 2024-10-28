import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

const billQuery = (supabase: SupabaseClient<Database>) =>
  supabase.from('bill').select(
    `
id,
title,
participants: participant (id, name),
expenses: expense (
  id,
  title,
  amount,
  paidBy:participant!paid_by  (id, name),
  participants:participant (id, name)
)
`
  );

export type BillQuery = QueryData<ReturnType<typeof billQuery>>;

export default billQuery;

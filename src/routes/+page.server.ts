import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
  const { user } = await safeGetSession();

  if (!user) throw new Error('Unauthorized');

  const { data: bill, error } = await supabase.from('bills').insert({ user_id: user?.id }).select();

  if (error) throw error;

  return redirect(303, `/${bill?.[0].id}`);
};

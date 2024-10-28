import billQuery from '$lib/supabase/queries/bill';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import updateParticipants from '$lib/supabase/queries/updateParticipants';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: bill, error } = await billQuery(supabase).eq('id', params.id).single();
  if (error) throw error;

  return { bill };
};

export const actions = {
  update: async (event) => {
    try {
      const {
        params,
        request,
        locals: { supabase }
      } = event;
      const data = await request.formData();
      const title = data.get('title')?.toString().trim();

      if (!title) return fail(400, { title, missing: true });

      const { error } = await supabase.from('bill').update({ title }).eq('id', params.id);

      if (error) throw error;

      const participants = await updateParticipants({
        client: supabase,
        billId: params.id,
        participants: data
          .getAll('participant')
          .map((participant) => participant.toString().trim()) as string[],
        participantIds: data.getAll('participantId') as string[]
      });

      return {
        title: title.toString(),
        participants: participants?.map((participant) => participant.data)
      };
    } catch (err) {
      console.error(err);
      return fail(500, { error: `Failed to update bill ${err}` });
    }
  },
  'save-expense': async ({ params, request, locals: { supabase } }) => {
    const data = await request.formData();
    const expenseId = data.get('expenseId');
    const title = data.get('title');
    const amount = data.get('amount');
    const paidBy = data.get('paidBy');
    const participants = data.getAll('participants');

    if (!title || !amount || !paidBy || !participants) return fail(400, { missing: true });

    console.log({ title, amount, expenseId, paidBy, participants });

    const { data: expense } = await supabase
      .from('expense')
      .upsert({
        id: expenseId ? Number(expenseId) : undefined,
        title: title.toString(),
        amount: amount.toString(),
        paid_by: paidBy.toString(),
        participants: participants,
        bill_id: params.id
      })
      .select();

    return { expense };
  }
} satisfies Actions;

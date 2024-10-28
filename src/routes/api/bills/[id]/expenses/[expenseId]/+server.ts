export const DELETE = async ({ params, locals: { supabase } }) => {
  await supabase.from('expense').delete().eq('id', params.expenseId).eq('bill_id', params.id);
  return new Response(null, { status: 204 });
};

import { fail } from '@sveltejs/kit';

export const DELETE = async ({ params, locals: { supabase } }) => {
  const { error } = await supabase.from('expenses').delete().eq('id', params.id);

  if (error) {
    console.error({ error });
    return new Response(JSON.stringify(error), { status: 500 });
  }

  return new Response(null, { status: 204 });
};

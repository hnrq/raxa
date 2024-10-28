import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

type UpdateParticipantsOpts = {
  client: SupabaseClient<Database>;
  participants: string[];
  participantIds: string[];
  billId: string;
};

const updateParticipants = async ({
  client,
  billId,
  participants,
  participantIds
}: UpdateParticipantsOpts) =>
  Promise.all(
    participants.map((name, i) => {
      return participantIds[i]
        ? client
            .from('participant')
            .update({ name: name.toString() })
            .eq('id', participantIds[i])
            .select()
            .single()
        : client
            .from('participant')
            .insert({ name: name.toString(), bill_id: billId })
            .select()
            .single();
    })
  );

export default updateParticipants;

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

type UpdateParticipantsOpts = {
  client: SupabaseClient<Database>;
  participants: string[];
  participantActions: string[];
  participantIds: string[];
  billId: string;
};

const updateParticipants = async ({
  client,
  billId,
  participantActions,
  participants,
  participantIds
}: UpdateParticipantsOpts) =>
  Promise.all(
    participants.map((name, i) => {
      const query = client.from('participants');
      console.log(participantActions[i], participantIds[i], name);

      if (participantActions[i] === 'delete')
        return query.delete().eq('id', participantIds[i]).select().single();
      if (participantActions[i] === 'update')
        return query.update({ name }).eq('id', participantIds[i]).select().single();
      return query.insert({ name, bill_id: billId }).select().single();
    })
  );

export default updateParticipants;

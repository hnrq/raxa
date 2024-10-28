<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import Dialog from '$lib/components/Dialog.svelte';
  import FormActions from '$lib/components/FormActions.svelte';
  import type { ActionResult } from '@sveltejs/kit';
  import type { Bill } from '../stores/bill.svelte';
  import type createBill from '../stores/bill.svelte';
  import { getContext } from 'svelte';

  const { bill, participants } = getContext<ReturnType<typeof createBill>>('bill');

  let { onclose }: { onclose: () => void } = $props();

  let loading = $state(false);
  let newParticipantCount = $state(Object.keys(participants).length === 0 ? 1 : 0);
</script>

{#snippet participantField(participant: Partial<Bill['participants'][number]>, index: number)}
  <label style="display: none;" for={`participant-${index}`}>
    Participant #{index}
  </label>
  <input type="hidden" name="participantId" value={participant.id} required />
  <input
    type="text"
    disabled={loading}
    id={`participant-${index}`}
    name="participant"
    placeholder={`Participant #${index + 1}`}
    value={participant.name}
    required
  />
{/snippet}

<Dialog open={$page.state.modalShown === 'bill'} {onclose}>
  <form
    method="POST"
    action="?/update"
    use:enhance={() => {
      loading = true;

      return async ({
        result,
        update
      }: {
        result: ActionResult<{ title: string; participants: Bill['participants'] }>;
        update: () => void;
      }) => {
        if (result.type !== 'success') return;
        if (!result.data) return;

        bill.title = result.data.title;
        result.data.participants.forEach((participant) => {
          participants[participant.id] = participant;
        });

        onclose();
        update();

        loading = false;
      };
    }}
  >
    <label for="title">Title</label>
    <!-- svelte-ignore a11y_autofocus -->
    <input
      id="title"
      disabled={loading}
      autofocus
      type="text"
      name="title"
      value={bill.title ?? ''}
      required
    />
    <label for="participants">Participants</label>
    {#each Object.values(participants) as participant, index}
      {@render participantField(participant, index)}
    {/each}
    {#each Array.from({ length: newParticipantCount }) as _, index}
      {@render participantField({ name: '' }, Object.keys(participants).length + index)}
    {/each}
    <button type="button" onclick={() => (newParticipantCount += 1)}>+</button>
    <FormActions disabled={loading} oncancel={onclose} />
  </form>
</Dialog>

<style>
  form {
    display: flex;
    gap: var(--base-spacing);
    flex-direction: column;
    margin-bottom: 1rem;
    min-width: 300px;
    padding: 0 calc(var(--base-spacing) * 2);
  }

  :global(.form-actions) {
    align-self: flex-end;
  }
</style>

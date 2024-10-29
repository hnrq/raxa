<script lang="ts" module>
  export type FormParticipant = Partial<Bill['participants'][number]> & {
    action?: 'delete' | 'create' | 'update';
  };
</script>

<script lang="ts">
  import { enhance } from '$app/forms';
  import Dialog from '$lib/components/Dialog.svelte';
  import FormActions from '$lib/components/FormActions.svelte';
  import type { ActionResult } from '@sveltejs/kit';
  import type { Bill } from '../stores/bill';
  import type createBill from '../stores/bill';
  import { getContext } from 'svelte';

  const { bill, updateBill } = getContext<ReturnType<typeof createBill>>('bill');

  let { open, onclose }: { onclose: () => void; open: boolean } = $props();

  let loading = $state(false);
  let formParticipants: FormParticipant[] = $state(
    $bill.participants.map((participant) => ({ ...participant, action: 'update' }))
  );

  const handleDeleteParticipantField = (participant: FormParticipant, index: number) => {
    if (participant.action === 'create') formParticipants.splice(index, 1);
    else formParticipants[index].action = 'delete';
  };

  $effect(() => {
    if (formParticipants.length === 0) formParticipants.push({ action: 'create' });
  });
</script>

{#snippet participantField(participant: FormParticipant, index: number)}
  <div class="bill__participant" class:bill__participant--delete={participant.action === 'delete'}>
    <label style="display: none;" for={`participant-${index}`}>
      Participant #{index}
    </label>
    <input type="hidden" name="participantAction" bind:value={participant.action} required />
    <input type="hidden" name="participantId" value={participant.id} required />
    <input
      type="text"
      disabled={loading}
      readonly={participant.action === 'delete'}
      id={`participant-${index}`}
      name="participant"
      placeholder={`Participant #${index + 1}`}
      value={participant.name}
      required
    />
    {#if participant.action !== 'delete'}
      <button type="button" onclick={() => handleDeleteParticipantField(participant, index)}>
        -
      </button>
    {:else}
      <button type="button" onclick={() => (participant.action = 'update')}>+</button>
    {/if}
  </div>
{/snippet}

<Dialog {open} {onclose}>
  <form
    method="POST"
    action="?/update"
    use:enhance={() => {
      loading = true;

      return async ({
        result,
        update
      }: {
        result: ActionResult<{ bill: Bill }>;
        update: () => void;
      }) => {
        if (result.type !== 'success') return;
        if (!result.data) return;

        updateBill(result.data.bill);

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
      value={$bill.title ?? ''}
      required
    />
    <label for="participants">Participants</label>
    {#each formParticipants as participant, index}
      {@render participantField(participant, index)}
    {/each}
    <button
      type="button"
      class="button--text"
      onclick={() => formParticipants.push({ action: 'create' })}
    >
      +
    </button>
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

  .bill__participant {
    display: flex;
    gap: var(--base-spacing);
  }

  .bill__participant input[type='text'] {
    flex: 1;
  }

  .bill__participant.bill__participant--delete input[type='text'] {
    border-color: red;
  }
</style>

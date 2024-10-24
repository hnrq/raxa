<script lang="ts">
  import FormActions from '$lib/components/FormActions.svelte';

  let {
    onsubmit,
    initialValue,
    oncancel,
    disabled
  }: {
    disabled?: boolean;
    onsubmit: (event: SubmitEvent) => void;
    initialValue?: string;
    oncancel: () => void;
  } = $props();
</script>

<form {onsubmit} class="participants-form">
  <!-- svelte-ignore a11y_autofocus -->
  <textarea
    placeholder="Type participants separated by comma"
    name="participants"
    id="participants"
    value={initialValue}
    required
    autofocus
    {disabled}
  ></textarea>
  <div class="participants-form__actions">
    <FormActions {disabled} {oncancel} />
  </div>
</form>

<style>
  .participants-form {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: var(--base-spacing);
  }
  .participants-form__actions {
    display: flex;
    gap: var(--base-spacing);
    justify-content: right;
  }
</style>

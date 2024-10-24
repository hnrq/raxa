<script lang="ts">
  import FormActions from '$lib/components/FormActions.svelte';

  let {
    onsubmit,
    oncancel,
    disabled,
    initialValue
  }: {
    oncancel: () => void;
    onsubmit: (event: SubmitEvent) => void;
    disabled?: boolean;
    initialValue?: string;
  } = $props();
</script>

<form class="bill__title-form" {onsubmit}>
  <label for="title">Title</label>
  <!-- svelte-ignore a11y_autofocus -->
  <input id="title" {disabled} autofocus type="text" name="title" value={initialValue} required />
  <FormActions {disabled} {oncancel} />
</form>

<style>
  .bill__title-form {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .bill__title-form label {
    display: none;
  }

  .bill__title-form input {
    flex: 1;
    font-size: 2rem;
  }
</style>

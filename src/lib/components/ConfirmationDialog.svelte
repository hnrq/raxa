<script lang="ts">
  import Dialog from '$lib/components/Dialog.svelte';

  let {
    open,
    title,
    onconfirm,
    cancelLabel = 'Cancel',
    confirmLabel,
    message,
    disabled,
    oncancel
  }: {
    cancelLabel?: string;
    confirmLabel: string;
    disabled?: boolean;
    message: string;
    title: string;
    open: boolean;
    onconfirm: () => void;
    oncancel: () => void;
  } = $props();
</script>

<Dialog {open} onclose={oncancel}>
  <div class="confirmation-dialog">
    <h4>{title}</h4>
    <p>{message}</p>
    <div class="confirmation-dialog__actions">
      <button {disabled} onclick={oncancel} class="button--text">{cancelLabel}</button>
      <button {disabled} onclick={onconfirm}>{confirmLabel}</button>
    </div>
  </div>
</Dialog>

<style>
  .confirmation-dialog {
    display: flex;
    flex-direction: column;
    gap: calc(2 * var(--base-spacing));
    padding: calc(2 * var(--base-spacing));
  }

  .confirmation-dialog__actions {
    margin-left: auto;
    display: flex;
    gap: var(--base-spacing);
  }

  h4 {
    margin: 0;
  }
</style>

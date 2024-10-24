<script lang="ts">
  import { onMount, type Snippet } from 'svelte';

  let {
    open = $bindable(),
    children,
    onclose
  }: { open: boolean; children: Snippet; onclose?: () => void } = $props();

  let dialog: HTMLDialogElement;

  const handleClose = () => {
    open = false;
    onclose?.();
  };

  $effect(() => {
    if (open) dialog.showModal();
    else dialog.close();
  });

  onMount(() => {
    const clickEvent = (event: MouseEvent) => {
      if (event.target === dialog) handleClose();
    };
    dialog.addEventListener('click', clickEvent);

    return () => {
      dialog.removeEventListener('click', clickEvent);
    };
  });
</script>

<dialog bind:this={dialog}>
  <button onclick={handleClose} class="button--text">Close</button>
  {@render children()}
</dialog>

<style>
  dialog {
    background: var(--color-background);
  }

  dialog[open] {
    padding: 0;
    border: 0;
    display: flex;
    flex-direction: column;
    gap: var(--base-spacing);
  }

  button {
    margin-left: auto;
  }

  dialog::backdrop {
    background-color: var(--text-low);
  }
</style>

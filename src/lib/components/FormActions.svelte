<script lang="ts">
  let {
    oncancel,
    saveLabel = 'Save',
    cancelLabel = 'Cancel',
    disabled = false
  }: {
    oncancel: () => void;
    saveLabel?: string;
    cancelLabel?: string;
    disabled?: boolean;
  } = $props();
</script>

<div class="form-actions">
  <button {disabled} type="reset" onclick={oncancel} class="button--text">{cancelLabel}</button>
  <button {disabled} type="submit">{saveLabel}</button>
</div>

<style>
  .form-actions {
    display: flex;
    gap: var(--base-spacing);
  }
</style>

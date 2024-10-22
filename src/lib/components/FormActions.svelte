<script lang="ts">
	const {
		oncancel,
		saveLabel = 'Save',
		cancelLabel = 'Cancel'
	}: { oncancel: () => void; saveLabel?: string; cancelLabel?: string } = $props();
</script>

<div class="form-actions">
	<button type="reset" onclick={oncancel}>{cancelLabel}</button>
	<button type="submit">{saveLabel}</button>
</div>

<style>
	.form-actions {
		display: flex;
		gap: var(--base-spacing);
	}
</style>

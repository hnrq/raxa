<script lang="ts">
	let { open, children } = $props<{ open: boolean }>();

	let dialog: HTMLDialogElement;

	$effect(() => {
		if (open) dialog.showModal();
		else dialog.close();
	});
</script>

<dialog bind:this={dialog}>
	<button
		onclick={() => {
			open = false;
		}}>Close</button
	>
	{@render children()}
</dialog>

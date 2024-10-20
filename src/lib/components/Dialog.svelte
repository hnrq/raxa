<script lang="ts">
	import { onMount } from 'svelte';

	let { open, children } = $props<{ open: boolean; children: unknown }>();

	let dialog: HTMLDialogElement;

	$effect(() => {
		if (open) dialog.showModal();
		else dialog.close();
	});

	onMount(() => {
		const clickEvent = (event: MouseEvent) => {
			if (event.target === dialog) open = false;
		};
		dialog.addEventListener('click', clickEvent);

		return () => {
			dialog.removeEventListener('click', clickEvent);
		};
	});
</script>

<dialog bind:this={dialog}>
	<button onclick={() => (open = false)}> Close </button>
	{@render children()}
</dialog>

<style>
	dialog {
		padding: 0;
		border: 0;
	}
</style>

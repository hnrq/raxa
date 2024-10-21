<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	let { open = $bindable(), children }: { open: boolean; children: Snippet } = $props();

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

<dialog bind:this={dialog} in:fade out:fade>
	<button onclick={() => (open = false)}> Close </button>
	{@render children()}
</dialog>

<style>
	dialog {
		padding: 0;
		border: 0;
	}
</style>

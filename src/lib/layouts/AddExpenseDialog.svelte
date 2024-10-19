<script lang="ts">
	import Dialog from '$lib/components/Dialog.svelte';

	let { open, onSubmit, participants } = $props<{
		open: boolean;
		onSubmit: () => void;
		participants: string[];
	}>();
</script>

<Dialog {open}></Dialog>

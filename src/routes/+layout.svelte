<!-- +layout.svelte -->
<script>
	import '@fontsource-variable/roboto-mono';

	const { children } = $props();
</script>

{@render children()}

<style>
	:global(*) {
		font-family: 'Roboto Mono Variable', monospace;
	}
</style>

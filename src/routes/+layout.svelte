<!-- +layout.svelte -->
<script>
	import '@fontsource-variable/roboto-mono';
	import '$lib/theme/index.css';

	let { children } = $props();
</script>

{@render children()}

<style>
	:global(*) {
		font-family: 'Roboto Mono Variable', monospace;
	}
</style>

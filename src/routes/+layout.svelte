<!-- +layout.svelte -->
<script>
	import '$lib/theme/index.css';

	const { children } = $props();
</script>

{@render children()}

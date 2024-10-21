<script>
	import client from '$lib/api/client';
	import '$lib/theme/index.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';

	const { children } = $props();
</script>

<QueryClientProvider {client}>
	{@render children()}
</QueryClientProvider>

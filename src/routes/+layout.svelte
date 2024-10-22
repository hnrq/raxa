<script lang="ts">
	import { browser } from '$app/environment';
	import client from '$lib/api/client';
	import '$lib/theme/index.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	const { children } = $props();

	onMount(() => {
		if (browser)
			document.body.addEventListener('keydown', (e: KeyboardEvent) => {
				if (!(e.key === 'Enter' && (e.metaKey || e.ctrlKey)) || !e.target) return;

				if ('form' in e.target) {
					const formElement = e.target.form as HTMLFormElement;
					formElement?.requestSubmit();
				}
			});
	});
</script>

<QueryClientProvider {client}>
	{@render children()}
</QueryClientProvider>

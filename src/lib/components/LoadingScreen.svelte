<script lang="ts">
	const { message = 'Loading...', subtitle }: { message?: string; subtitle?: string } = $props();
</script>

<div class="loading-screen">
	<span>{message}</span>
	{#if subtitle}
		<small>{subtitle}</small>
	{/if}
</div>

<style>
	.loading-screen {
		display: flex;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		align-items: center;
		height: 100vh;
	}

	.loading-screen small {
		color: var(--text-medium);
	}
</style>

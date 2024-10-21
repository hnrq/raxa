<script lang="ts">
	let { label, onRemove }: { label: string; onRemove?: () => void } = $props();
</script>

<div class="tag">
	<span>{label}</span>
	{#if onRemove}<button onclick={onRemove}>x</button>{/if}
</div>

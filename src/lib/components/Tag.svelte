<script lang="ts">
	let { label, onRemove } = $props<{ label: string; onRemove?: () => void }>();
</script>

<div class="tag">
	<span>{label}</span>
	{#if onRemove}<button onclick={onRemove}>x</button>{/if}
</div>

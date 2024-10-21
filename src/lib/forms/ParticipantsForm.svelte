<script lang="ts">
	let {
		onsubmit,
		initialValue,
		oncancel
	}: {
		onsubmit: (event: SubmitEvent) => void;
		initialValue?: string;
		oncancel: () => void;
	} = $props();
</script>

<form {onsubmit}>
	<textarea
		placeholder="Type participants separated by comma"
		name="participants"
		value={initialValue}
		required
	></textarea>
	<button onclick={oncancel}>Cancel</button>
	<button type="submit">Save</button>
</form>

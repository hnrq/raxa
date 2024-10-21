<script lang="ts">
	const {
		onsubmit,
		initialValue,
		oncancel
	}: {
		onsubmit: (event: SubmitEvent) => void;
		initialValue?: string;
		oncancel: () => void;
	} = $props();
</script>

<form {onsubmit} class="participants-form">
	<label for="participants"> Participants:</label>
	<textarea
		placeholder="Type participants separated by comma"
		name="participants"
		id="participants"
		value={initialValue}
		required
	></textarea>
	<div class="participants-form__actions">
		<button type="reset" onclick={oncancel}>Cancel</button>
		<button type="submit">Save</button>
	</div>
</form>

<style>
	.participants-form {
		display: flex;
		flex-direction: column;
		gap: var(--base-spacing);
	}
	.participants-form__actions {
		display: flex;
		gap: var(--base-spacing);
		justify-content: right;
	}
</style>

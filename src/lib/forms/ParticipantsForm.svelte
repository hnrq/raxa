<script lang="ts">
	const {
		onsubmit,
		initialValue,
		oncancel,
		disabled
	}: {
		disabled?: boolean;
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
		{disabled}
	></textarea>
	<div class="participants-form__actions">
		<button type="reset" {disabled} onclick={oncancel}>Cancel</button>
		<button type="submit" {disabled}>Save</button>
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

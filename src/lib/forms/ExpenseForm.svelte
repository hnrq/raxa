<script lang="ts">
	import type { Expense } from '$lib/types';

	let {
		onsubmit,
		oncancel,
		participants,
		initialValue
	}: {
		oncancel: () => void;
		onsubmit: (event: SubmitEvent) => void | Promise<void>;
		participants: string[];
		initialValue?: Expense;
	} = $props();
</script>

<form {onsubmit}>
	<label>
		Title:
		<input type="text" name="title" placeholder="Soda" value={initialValue?.title} required />
	</label>
	<label>
		Price:
		<input type="number" name="price" placeholder="5.00" value={initialValue?.price} required />
	</label>
	<label>
		Paid by:
		<select name="paidBy" required>
			{#each participants as participant}
				<option value={participant} selected={initialValue?.paidBy === participant}>
					{participant}
				</option>
			{/each}
		</select>
	</label>
	<label>
		Used by:
		{#each participants as participant}
			<label>
				<input type="checkbox" name="participants" value={participant} checked />
				{participant}
			</label>
		{/each}
	</label>
	<button onclick={oncancel}>Cancel</button>
	<button type="submit">Add</button>
</form>

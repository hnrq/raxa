<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebase/client';
	import authStore from '$lib/stores/auth';
	import { addDoc, collection } from 'firebase/firestore/lite';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	onMount(async () => {
		const { user } = get(authStore);

		if (user) {
			const result = await addDoc(collection(db, 'bills'), {
				ownedBy: user.uid,
				title: '',
				participants: [],
				expenses: []
			});
			goto(`/${result?.id}`);
		}
	});
</script>

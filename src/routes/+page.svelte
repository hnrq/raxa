<script lang="ts">
  import { goto } from '$app/navigation';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
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
        expenses: [],
        createdAt: new Date()
      });
      goto(`/${result?.id}`);
    }
  });
</script>

<LoadingScreen message="Generating a new bill..." subtitle="No deadbeats left behind" />

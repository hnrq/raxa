import { browser } from '$app/environment';
import { auth, initializeFirebase } from '$lib/firebase/client';
import authStore from '$lib/stores/auth';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export const load = async () => {
	if (!browser) return;

	initializeFirebase();

	await new Promise((resolve) => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				authStore.set({ isAuthenticated: true, user });
				resolve(user);
			} else await signInAnonymously(auth);
		});
	});
};

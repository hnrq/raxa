import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

type AuthStore = { isAuthenticated: false; user?: never } | { isAuthenticated: true; user: User };

const authStore = writable<AuthStore>({ isAuthenticated: false });

export default authStore;

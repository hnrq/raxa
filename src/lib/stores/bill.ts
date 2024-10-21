import type { Bill } from '$lib/types';
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { db } from '$lib/firebase/client';
import { addDoc, collection, deleteDoc } from 'firebase/firestore/lite';
import { derived, get, writable } from 'svelte/store';
import { page } from '$app/stores';

export const fetchBill = async (id: string) => (await getDoc(doc(db, 'bills', id))).data() as Bill;

const createBill = (initialState?: Bill) => {
	const id = get(page).params.id;
	const participants = writable(initialState?.participants ?? []);
	const expenses = writable(initialState?.expenses ?? []);
	const total = derived(expenses, ($expenses) =>
		$expenses?.reduce((acc, { price }) => acc + price, 0)
	);

	const updateParticipants = async (p: Bill['participants']) => {
		await updateDoc(doc(db, 'bills', id), { participants: [...new Set(p)] });
		participants.set(p);
	};

	const addExpense = async (expense: Bill['expenses'][number]) => {
		await addDoc(collection(db, 'bills', id, 'expenses'), expense);
		expenses.update((value) => [...value, expense]);
	};

	const removeExpense = async (id: string) => {
		await deleteDoc(doc(db, 'bills', id, 'expenses', id));
	};

	return {
		participants: { subscribe: participants.subscribe },
		expenses: { subscribe: expenses.subscribe },
		total: { subscribe: total.subscribe },
		updateParticipants,
		addExpense,
		removeExpense,
		set: (bill: Bill) => {
			participants.set(bill.participants);
			expenses.set(bill.expenses);
		}
	};
};

export default createBill;

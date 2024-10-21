import type { Bill } from '$lib/types';
import {
	doc,
	getDoc,
	getDocs,
	updateDoc,
	addDoc,
	collection,
	deleteDoc
} from 'firebase/firestore/lite';
import { db } from '$lib/firebase/client';
import { derived, get, writable } from 'svelte/store';
import { page } from '$app/stores';

export const fetchBill = async (id: string) => {
	const [billSnapshot, expensesSnapshot] = await Promise.all([
		getDoc(doc(db, 'bills', id)),
		getDocs(collection(db, 'bills', id, 'expenses'))
	]);

	return {
		...billSnapshot.data(),
		expenses: expensesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
	} as Bill;
};

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

	const addExpense = async (data: Omit<Bill['expenses'][number], 'id'>) => {
		const expense = await addDoc(collection(db, 'bills', id, 'expenses'), data);
		expenses.update((value) => [...value, { ...data, id: expense.id }]);
	};

	const updateExpenseParticipants = async (expenseId: string, participants: string[]) => {
		await updateDoc(doc(db, 'bills', id, 'expenses', expenseId), {
			participants: [...new Set(participants)]
		});
		expenses.update((value) =>
			value.map((expense) => (expense.id === expenseId ? { ...expense, participants } : expense))
		);
	};

	const removeExpense = async (id: string) => {
		await deleteDoc(doc(db, 'bills', id, 'expenses', id));
	};

	return {
		participants: { subscribe: participants.subscribe },
		expenses: { subscribe: expenses.subscribe },
		total: { subscribe: total.subscribe },
		updateParticipants,
		updateExpenseParticipants,
		addExpense,
		removeExpense,
		set: (bill: Bill) => {
			participants.set(bill.participants);
			expenses.set(bill.expenses);
		}
	};
};

export default createBill;

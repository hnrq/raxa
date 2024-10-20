import type { Expense } from '$lib/types';
import { uuidv4 } from '$lib/utils';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => ({ bill: getBill(params.id) });

/** @type {import('./$types').Actions} */
export const actions = {
	'add-expense': async ({ request }) => {
		const formData = await request.formData();

		return {
			expense: <Expense>{
				id: uuidv4(),
				title: <string>formData.get('title'),
				price: parseFloat(<string>formData.get('price')),
				paidBy: <string>formData.get('paidBy'),
				participants: new Set(formData.getAll('participants'))
			}
		};
	},
	'add-participant': async ({ request }) => {
		const formData = await request.formData();
		return {
			participants: (<string>formData.get('participants'))
				.split(',')
				.map((participant) => participant.trim())
		};
	}
};

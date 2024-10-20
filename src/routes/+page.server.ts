import createBill from '$lib/api/createBill';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	// TODO (@hnrq): create a new Bill before redirecting
	const { id } = await createBill();
	redirect(302, `/${id}`);
}

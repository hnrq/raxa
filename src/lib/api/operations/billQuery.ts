import { db } from '$lib/firebase/client';
import type { Bill } from '$lib/types';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { getDoc, doc } from 'firebase/firestore/lite';

type BillQueryOptions = { id: string } & Omit<CreateQueryOptions<Bill>, 'queryFn' | 'queryKey'>;

const createBillQuery = ({ id, ...opts }: BillQueryOptions) =>
  createQuery({
    ...opts,
    queryKey: ['bills', id],
    queryFn: async () => (await getDoc(doc(db, 'bills', id))).data() as Bill
  });

export default createBillQuery;

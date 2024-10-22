import { db } from '$lib/firebase/client';
import type { Bill } from '$lib/types';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { getDoc, doc, getDocs, collection, query, orderBy } from 'firebase/firestore/lite';

type BillQueryOptions = { id: string } & Omit<CreateQueryOptions<Bill>, 'queryFn' | 'queryKey'>;

const createBillQuery = ({ id, ...opts }: BillQueryOptions) =>
  createQuery({
    ...opts,
    queryKey: ['bills', id],
    queryFn: async () => {
      const [billSnapshot, expensesSnapshot] = await Promise.all([
        getDoc(doc(db, 'bills', id)),
        getDocs(query(collection(db, 'bills', id, 'expenses'), orderBy('createdAt')))
      ]);

      return {
        ...billSnapshot.data(),
        expenses: expensesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      } as Bill;
    }
  });

export default createBillQuery;

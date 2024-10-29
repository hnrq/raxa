// This implementation was adapted from https://github.com/ahtrahdis7/node-splitwise-js/blob/main/index.js

import type { Bill } from '../../routes/[id]/stores/bill';

type Debt = {
  from: Bill['participants'][number];
  to: Bill['participants'][number];
  amount: number;
};

type DebtRelation = { [payer: string]: { [consumer: string]: number } };

export const calcDebts = (expenses: Bill['expenses'], participants: Bill['participants']) => {
  const debts: DebtRelation = {};
  const participantsById = participants.reduce(
    (acc, p) => ({ ...acc, [p.id]: p }),
    {} as Record<number | string, Bill['participants'][number]>
  );

  expenses.forEach(({ amount, paidBy, participants }) => {
    if (paidBy == null) return;
    const share = amount / participants.length;
    if (!debts[paidBy.id]) debts[paidBy.id] = {};

    // Each consumer owes the paidBy their share
    participants.forEach((consumer) => {
      if (consumer !== paidBy)
        debts[paidBy.id][consumer.id] = (debts[paidBy.id][consumer.id] ?? 0) + share;
    });
  });

  return Object.entries(debts)
    .reduce(
      (acc, [payer, consumers]) =>
        [
          ...acc,
          ...Object.entries(consumers).map(([consumer, amount]) =>
            consumer !== payer
              ? {
                  from: participantsById[consumer],
                  to: participantsById[payer],
                  amount
                }
              : undefined
          )
        ] as Debt[],
      [] as Debt[]
    )
    .filter(Boolean);
};

const simplifiedDebts = (expenses: Bill['expenses'], participants: Bill['participants']) => {
  const splits: Debt[] = [];
  const transactionsByUser = new Map<string | number, number>();
  const participantsById = participants.reduce(
    (acc, p) => ({ ...acc, [p.id]: p }),
    {} as Record<number | string, Bill['participants'][number]>
  );

  expenses.forEach(({ participants, paidBy, amount }) => {
    if (paidBy == null) return;
    if (!transactionsByUser.has(paidBy.id)) transactionsByUser.set(paidBy.id, 0);
    participants.forEach((participant) => {
      if (!transactionsByUser.has(participant.id)) transactionsByUser.set(participant.id, 0);
      transactionsByUser.set(
        paidBy.id,
        <number>transactionsByUser.get(paidBy.id) + amount / participants.length
      );
      transactionsByUser.set(
        participant.id,
        <number>transactionsByUser.get(participant.id) - amount / participants.length
      );
    });
  });

  const settleSimilarFigures = () => {
    const vis = new Map();

    for (const tr1 of transactionsByUser.keys()) {
      vis.set(tr1, 1);
      for (const tr2 of transactionsByUser.keys()) {
        if (!vis.has(tr2) && tr1 !== tr2) {
          if (transactionsByUser.get(tr2) == -(<number>transactionsByUser.get(tr1))) {
            if (<number>transactionsByUser.get(tr2) > <number>transactionsByUser.get(tr1))
              splits.push({
                from: participantsById[tr1],
                to: participantsById[tr2],
                amount: <number>transactionsByUser.get(tr2)
              });
            else
              splits.push({
                from: participantsById[tr2],
                to: participantsById[tr1],
                amount: <number>transactionsByUser.get(tr1)
              });
            transactionsByUser.set(tr2, 0);
            transactionsByUser.set(tr1, 0);
          }
        }
      }
    }
  };

  const getMaxMinCredit = () => {
    let max_ob,
      min_ob,
      max = Number.MIN_VALUE,
      min = Number.MAX_VALUE;
    for (const tr of transactionsByUser.keys()) {
      if (<number>transactionsByUser.get(tr) < min) {
        min = <number>transactionsByUser.get(tr);
        min_ob = tr;
      }
      if (<number>transactionsByUser.get(tr) > max) {
        max = <number>transactionsByUser.get(tr);
        max_ob = tr;
      }
    }
    return [min_ob, max_ob];
  };

  const helper = () => {
    const minMax = getMaxMinCredit();
    if (minMax[0] === undefined || minMax[1] === undefined) return;
    const min_value = Math.min(
      -(<number>transactionsByUser.get(minMax[0])),
      <number>transactionsByUser.get(minMax[1])
    );

    if (min_value !== 0) {
      transactionsByUser.set(minMax[0], <number>transactionsByUser.get(minMax[0]) + min_value);
      transactionsByUser.set(minMax[1], <number>transactionsByUser.get(minMax[1]) - min_value);

      splits.push({
        from: participantsById[minMax[0]],
        to: participantsById[minMax[1]],
        amount: min_value
      });
      helper();
    }
  };

  settleSimilarFigures();
  helper();

  return splits;
};

export default simplifiedDebts;

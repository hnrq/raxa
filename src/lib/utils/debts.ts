// This implementation was adapted from https://github.com/ahtrahdis7/node-splitwise-js/blob/main/index.js

import type { Expense } from '$lib/types';

type Debt = {
  from: string;
  to: string;
  amount: number;
};

type DebtRelation = { [payer: string]: { [consumer: string]: number } };

export const calcDebts = (expenses: Expense[]) => {
  const debts: DebtRelation = {};

  expenses.forEach(({ price, paidBy, participants }) => {
    const share = price / participants.length;
    if (!debts[paidBy]) debts[paidBy] = {};

    // Each consumer owes the paidBy their share
    participants.forEach((consumer) => {
      if (consumer !== paidBy) debts[paidBy][consumer] = (debts[paidBy][consumer] ?? 0) + share;
    });
  });

  return Object.entries(debts).reduce(
    (acc, [payer, consumers]) =>
      [
        ...acc,
        ...Object.entries(consumers).map(([consumer, amount]) => ({
          from: consumer,
          to: payer,
          amount
        }))
      ] as Debt[],
    [] as Debt[]
  );
};

const simplifiedDebts = (expenses: Expense[]) => {
  const splits: Debt[] = [];
  const transactionsByUser = new Map();

  expenses.forEach(({ participants, paidBy, price }) => {
    if (!transactionsByUser.has(paidBy)) transactionsByUser.set(paidBy, 0);
    participants.forEach((participant) => {
      if (!transactionsByUser.has(participant)) transactionsByUser.set(participant, 0);
      transactionsByUser.set(paidBy, transactionsByUser.get(paidBy) + price / participants.length);
      transactionsByUser.set(
        participant,
        transactionsByUser.get(participant) - price / participants.length
      );
    });
  });

  const settleSimilarFigures = () => {
    const vis = new Map();

    for (const tr1 of transactionsByUser.keys()) {
      vis.set(tr1, 1);
      for (const tr2 of transactionsByUser.keys()) {
        if (!vis.has(tr2) && tr1 !== tr2) {
          if (transactionsByUser.get(tr2) == -transactionsByUser.get(tr1)) {
            if (transactionsByUser.get(tr2) > transactionsByUser.get(tr1))
              splits.push({ from: tr1, to: tr2, amount: transactionsByUser.get(tr2) });
            else splits.push({ from: tr2, to: tr1, amount: transactionsByUser.get(tr1) });
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
      if (transactionsByUser.get(tr) < min) {
        min = transactionsByUser.get(tr);
        min_ob = tr;
      }
      if (transactionsByUser.get(tr) > max) {
        max = transactionsByUser.get(tr);
        max_ob = tr;
      }
    }
    return [min_ob, max_ob];
  };

  const helper = () => {
    const minMax = getMaxMinCredit();
    if (minMax[0] === undefined || minMax[1] === undefined) return;
    const min_value = Math.min(
      -transactionsByUser.get(minMax[0]),
      transactionsByUser.get(minMax[1])
    );

    if (min_value !== 0) {
      transactionsByUser.set(minMax[0], transactionsByUser.get(minMax[0]) + min_value);
      transactionsByUser.set(minMax[1], transactionsByUser.get(minMax[1]) - min_value);

      splits.push({ from: minMax[0], to: minMax[1], amount: min_value });
      helper();
    }
  };

  settleSimilarFigures();
  helper();

  return splits;
};

export default simplifiedDebts;

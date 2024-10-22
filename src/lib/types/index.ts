export type Expense = {
  id: string;
  title: string;
  price: number;
  paidBy: string;
  participants: string[];
};

export type Bill = {
  ownedBy: string;
  title: string;
  participants: string[];
  createdAt: Date;
};

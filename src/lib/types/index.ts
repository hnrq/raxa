export type Expense = {
	title: string;
	price: number;
	paidBy: string;
	participants: Set<string>;
};

export type Bill = {
	id: string;
	title: string;
	participants: string[];
	expenses: Expense[];
};

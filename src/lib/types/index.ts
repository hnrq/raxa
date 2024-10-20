export type Expense = {
	title: string;
	price: number;
	paidBy: string;
	participants: Set<string>;
};

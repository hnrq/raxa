export type Expense = {
	title: string;
	price: number;
	paidBy: string;
	participants: Set<string>;
};

export type Bill = {
	ownedBy: string;
	createdAt: Date;
	updatedAt: Date;
	title: string;
	participants: string[];
	expenses: Expense[];
};

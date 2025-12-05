export interface Split {
    id: string;
    groupExpenseId: string;
    userId: string;
    amountOwed: number; // Changed from 'amount' to match backend
    amountPaid?: number;
    percentage?: number;
    isPaid: boolean; // Changed from 'settled' to match backend
    paidAt?: string; // Changed from 'settledAt' to match backend
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface CreateSplitDto {
    userId: string;
    amount?: number;
    percentage?: number;
}

export interface SettleSplitDto {
    splitIds: string[];
    paymentMethod?: string;
    notes?: string;
}

export interface SplitSummary {
    userId: string;
    userName: string;
    totalOwed: number;
    totalPaid: number;
    balance: number;
}

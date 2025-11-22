export interface Customer {
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    paymentToken: string;
    createdAt: string;
    blockedUntil?: string;
}

export interface Transaction {
    transactionId: string;
    customerId: string;
    amount: number;
    currency: string;
    status: 'success' | 'failed';
    timestamp: string;
    errorMessage?: string;
}

export interface CreateCustomerRequest {
    firstName: string;
    lastName: string;
    email: string;
    paymentToken: string;
}

export interface CreateTransactionRequest {
    customerId: string;
    amount: number;
    currency: string;
}

export interface FraudAlert {
    alertId: string;
    customerId: string;
    transactionCount: number;
    timeWindow: string;
    timestamp: string;
    blockedUntil: string;
}
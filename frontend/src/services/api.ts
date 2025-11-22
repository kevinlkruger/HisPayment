import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Customer {
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    paymentToken: string;
    createdAt: string;
}

export interface Transaction {
    transactionId: string;
    customerId: string;
    amount: number;
    currency: string;
    status: 'success' | 'failed';
    timestamp: string;
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

export const customerAPI = {
    createCustomer: async (data: CreateCustomerRequest) => {
        const response = await api.post<{ customerId: string }>('/customers', data);
        return response.data;
    },

    getCustomer: async (customerId: string) => {
        const response = await api.get<Customer>(`/customers/${customerId}`);
        return response.data;
    },
};

export const transactionAPI = {
    createTransaction: async (data: CreateTransactionRequest) => {
        const response = await api.post<{ transactionId: string }>('/transactions', data);
        return response.data;
    },

    getCustomerTransactions: async (customerId: string) => {
        const response = await api.get<Transaction[]>(`/customers/${customerId}/transactions`);
        return response.data;
    },
};
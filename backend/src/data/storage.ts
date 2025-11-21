import fs from 'fs';
import path from 'path';
import { Customer, Transaction } from '../types';

const DATA_DIR = path.join(__dirname, '../../data');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');

// Ensure data directory and files exist
function initializeStorage() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(CUSTOMERS_FILE)) {
        fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(TRANSACTIONS_FILE)) {
        fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify([], null, 2));
    }
}

// Customer operations
export function getCustomers(): Customer[] {
    initializeStorage();
    const data = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
    return JSON.parse(data);
}

export function saveCustomer(customer: Customer): void {
    const customers = getCustomers();
    customers.push(customer);
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2));
}

export function getCustomerById(customerId: string): Customer | undefined {
    const customers = getCustomers();
    return customers.find(c => c.customerId === customerId);
}

// Transaction operations
export function getTransactions(): Transaction[] {
    initializeStorage();
    const data = fs.readFileSync(TRANSACTIONS_FILE, 'utf-8');
    return JSON.parse(data);
}

export function saveTransaction(transaction: Transaction): void {
    const transactions = getTransactions();
    transactions.push(transaction);
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
}

export function getTransactionsByCustomerId(customerId: string): Transaction[] {
    const transactions = getTransactions();
    return transactions.filter(t => t.customerId === customerId);
}
import express, { Request, Response } from 'express';
import cors from 'cors';
import customerRoutes from './routes/customers';
import { Customer, Transaction } from './types';
import { getCustomers, saveTransaction } from './data/storage';
import crypto from 'crypto';
import { getCustomerById, updateCustomer, getTransactionsByCustomerId, saveFraudAlert } from './data/storage';
import type { FraudAlert } from './types';

// Duplicate transaction detection - store fingerprints with timestamps
interface TransactionFingerprint {
    fingerprint: string;
    timestamp: number;
}

const recentTransactions: TransactionFingerprint[] = [];

// Clean up old fingerprints (older than 5 seconds)
const cleanupFingerprints = () => {
    const fiveSecondsAgo = Date.now() - 5000;
    const validIndex = recentTransactions.findIndex(t => t.timestamp > fiveSecondsAgo);
    if (validIndex > 0) {
        recentTransactions.splice(0, validIndex);
    }
};

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/customers', customerRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'HisPayment API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/transactions', (req: Request, res: Response) => {
    const { customerId, amount, currency } = req.body;

    // Validate required fields
    if (!customerId || !amount || !currency) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate customer exists
    const customer = getCustomerById(customerId);
    if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
    }

    // Check if customer is currently blocked
    if (customer.blockedUntil) {
        const blockedUntilTime = new Date(customer.blockedUntil).getTime();
        if (Date.now() < blockedUntilTime) {
            const secondsRemaining = Math.ceil((blockedUntilTime - Date.now()) / 1000);
            return res.status(429).json({
                error: `Account temporarily blocked due to suspicious activity. Please wait ${secondsRemaining} seconds.`,
                blockedUntil: customer.blockedUntil
            });
        } else {
            // Block expired, clear it
            updateCustomer(customerId, { blockedUntil: undefined });
        }
    }

    // PART 5 FEATURE 1: Duplicate Transaction Detection
    cleanupFingerprints();
    const fingerprint = `${customerId}-${amount}-${currency}`;
    const isDuplicate = recentTransactions.some(t => t.fingerprint === fingerprint);

    if (isDuplicate) {
        return res.status(409).json({ error: 'Duplicate transaction detected within 5 seconds' });
    }

    // Add to recent transactions
    recentTransactions.push({ fingerprint, timestamp: Date.now() });

    // PART 5 FEATURE 2: Fraud Alert System - Check transaction count from actual DB
    const twoMinutesAgo = Date.now() - 120000;
    const recentDbTransactions = getTransactionsByCustomerId(customerId).filter(
        t => new Date(t.timestamp).getTime() > twoMinutesAgo
    );

    // Current transaction would be the 6th (we already have 5)
    if (recentDbTransactions.length >= 5) {
        const blockedUntil = new Date(Date.now() + 120000).toISOString(); // Block for 2 minutes

        // Update customer with block
        updateCustomer(customerId, { blockedUntil });

        // Log fraud alert
        const fraudAlert: FraudAlert = {
            alertId: crypto.randomUUID(),
            customerId,
            transactionCount: recentDbTransactions.length + 1,
            timeWindow: '2 minutes',
            timestamp: new Date().toISOString(),
            blockedUntil
        };
        saveFraudAlert(fraudAlert);

        console.log(`🚫 FRAUD ALERT: Customer ${customerId} blocked until ${blockedUntil}`);

        return res.status(429).json({
            error: 'Too many transactions. Account blocked for 2 minutes.',
            blockedUntil,
            fraudAlert: true
        });
    }

    // Create transaction
    const transaction: Transaction = {
        transactionId: crypto.randomUUID(),
        customerId,
        amount,
        currency,
        status: 'success',
        timestamp: new Date().toISOString()
    };

    saveTransaction(transaction);

    res.status(201).json({ transactionId: transaction.transactionId });
});
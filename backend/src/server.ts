import express, { Request, Response } from 'express';
import cors from 'cors';
import customerRoutes from './routes/customers';
import { Customer, Transaction } from './types';
import { getCustomers, saveTransaction } from './data/storage';
import crypto from 'crypto';

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
    const customers = getCustomers();
    if (!customers.find(c => c.customerId === customerId)) {
        return res.status(404).json({ error: 'Customer not found' });
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
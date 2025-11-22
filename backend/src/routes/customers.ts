import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { CreateCustomerRequest, Customer } from '../types';
import { saveCustomer } from '../data/storage';
import { isValidName, isValidEmail } from '../validators';
import { getCustomerById, getTransactionsByCustomerId } from '../data/storage';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    const { firstName, lastName, email, paymentToken }: CreateCustomerRequest = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !paymentToken) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    // Validate name fields (no special characters)
    if (!isValidName(firstName) || !isValidName(lastName)) {
        res.status(400).json({ error: 'Name contains invalid characters' });
        return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }

    // Create customer
    const customer: Customer = {
        customerId: crypto.randomUUID(),
        firstName,
        lastName,
        email: email.toLowerCase(),
        paymentToken,
        createdAt: new Date().toISOString()
    };

    saveCustomer(customer);

    res.status(200).json({ customerId: customer.customerId });
});

// GET single customer by ID
router.get('/:customerId', (req: Request, res: Response) => {
    const { customerId } = req.params;

    const customer = getCustomerById(customerId);

    if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
    }

    res.status(200).json(customer);
});

// GET all transactions for a customer
router.get('/:customerId/transactions', (req: Request, res: Response) => {
    const { customerId } = req.params;

    // Verify customer exists
    const customer = getCustomerById(customerId);
    if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
    }

    const transactions = getTransactionsByCustomerId(customerId);
    res.status(200).json(transactions);
});

export default router;
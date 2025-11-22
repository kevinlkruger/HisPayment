import request from 'supertest';
import express from 'express';
import customerRoutes from '../routes/customers';

const app = express();
app.use(express.json());
app.use('/customers', customerRoutes);

describe('Customer Endpoint Tests', () => {
    // PASSING TESTS (8)

    test('1. Valid customer creation', async () => {
        const response = await request(app)
            .post('/customers')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                paymentToken: 'tok_1234'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('customerId');
        expect(typeof response.body.customerId).toBe('string');
    });

    test('2. Valid customer with all fields', async () => {
        const response = await request(app)
            .post('/customers')
            .send({
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                paymentToken: 'tok_5678'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('customerId');
    });

    test('3. Customer with different valid email formats', async () => {
        const response = await request(app)
            .post('/customers')
            .send({
                firstName: 'Bob',
                lastName: 'Wilson',
                email: 'bob+tag@example.com',
                paymentToken: 'tok_9012'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('customerId');
    });

    test('4. Customer with uppercase email', async () => {
        const response = await request(app)
            .post('/customers')
            .send({
                firstName: 'Alice',
                lastName: 'Brown',
                email: 'ALICE@EXAMPLE.COM',
                paymentToken: 'tok_3456'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('customerId');
    });

    test('5. Customer with hyphenated last name', async () => {
        const response = await request(app)
            .post('/customers')
            .send({
                firstName: 'Mary',
                lastName: 'Smith-Johnson',
                email: 'mary@example.com',
                paymentToken: 'tok_7890'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('customerId');
    });

    test('6. Customer with long payment token', async () => {
        const response = await request(app)
            .post('/customers')
            .send({
                firstName: 'David',
                lastName: 'Lee',
                email: 'david@example.com',
                paymentToken: 'tok_' + 'a'.repeat(100)
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('customerId');
    });

    test('7. Customer with minimum valid data', async () => {
        const response = await request(app)
            .post('/customers')
            .send({
                firstName: 'Tom',
                lastName: 'Jones',
                email: 'tom@example.com',
                paymentToken: 'tok_min'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('customerId');
    });

    test('8. Customer generates unique IDs', async () => {
        const response1 = await request(app)
            .post('/customers')
            .send({
                firstName: 'User',
                lastName: 'One',
                email: 'user1@example.com',
                paymentToken: 'tok_111'
            });

        const response2 = await request(app)
            .post('/customers')
            .send({
                firstName: 'User',
                lastName: 'Two',
                email: 'user2@example.com',
                paymentToken: 'tok_222'
            });

        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);
        expect(response1.body.customerId).not.toBe(response2.body.customerId);
    });

    // FAILING TESTS (2)

    test('9. Invalid name with special characters', async () => {
        const response = await request(app)
            .post('/customers')
            .send({
                firstName: 'John@#$',
                lastName: 'Doe',
                email: 'john@example.com',
                paymentToken: 'tok_1234'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('invalid characters');
    });

    test('10. Invalid email format', async () => {
        const response = await request(app)
            .post('/customers')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'notanemail',
                paymentToken: 'tok_1234'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Invalid email');
    });
});
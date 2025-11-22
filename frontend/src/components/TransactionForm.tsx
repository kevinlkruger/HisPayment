import { useState } from 'react';
import { transactionAPI, type CreateTransactionRequest } from '../services/api';

interface TransactionFormProps {
    customerId: string;
    onTransactionCreated: (transactionId: string, status: string) => void;
}

export default function TransactionForm({ customerId, onTransactionCreated }: TransactionFormProps) {
    const [formData, setFormData] = useState({
        amount: '',
        currency: 'USD',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const transactionData: CreateTransactionRequest = {
                customerId,
                amount: parseFloat(formData.amount),
                currency: formData.currency,
            };

            const response = await transactionAPI.createTransaction(transactionData);
            onTransactionCreated(response.transactionId, 'success');
            // Reset form
            setFormData({ amount: '', currency: 'USD' });
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Failed to process transaction';
            setError(errorMsg);
            onTransactionCreated('', 'failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <h2>Process Transaction</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        Amount:
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                            style={{ marginLeft: '0.5rem', padding: '0.5rem', width: '200px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        Currency:
                        <select
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            style={{ marginLeft: '0.5rem', padding: '0.5rem', width: '200px' }}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </label>
                </div>

                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
                    {loading ? 'Processing...' : 'Process Transaction'}
                </button>
            </form>
        </div>
    );
}
import { useState } from 'react';
import { transactionAPI, type Transaction } from '../services/api';

interface TransactionHistoryProps {
    customerId: string;
}

function TransactionHistory({ customerId }: TransactionHistoryProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    const fetchTransactions = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await transactionAPI.getCustomerTransactions(customerId);
            setTransactions(data);
            setShowHistory(true);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <h2>Transaction History</h2>
            <button
                onClick={fetchTransactions}
                disabled={loading}
                style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}
            >
                {loading ? 'Loading...' : 'View Transaction History'}
            </button>

            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

            {showHistory && (
                <div>
                    {transactions.length === 0 ? (
                        <p>No transactions found for this customer.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f0f0f0' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '0.5rem', color: '#000' }}>Transaction ID</th>
                                    <th style={{ border: '1px solid #ddd', padding: '0.5rem', color: '#000' }}>Amount</th>
                                    <th style={{ border: '1px solid #ddd', padding: '0.5rem', color: '#000' }}>Currency</th>
                                    <th style={{ border: '1px solid #ddd', padding: '0.5rem', color: '#000' }}>Status</th>
                                    <th style={{ border: '1px solid #ddd', padding: '0.5rem', color: '#000' }}>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.transactionId}>
                                        <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                                            {transaction.transactionId}
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                                            {transaction.amount}
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                                            {transaction.currency}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '0.5rem',
                                                color: transaction.status === 'success' ? 'green' : 'red'
                                            }}
                                        >
                                            {transaction.status}
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                                            {new Date(transaction.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default TransactionHistory;
import { useState } from 'react';
import { customerAPI, type Customer } from '../services/api';

interface CustomerLookupProps {
    onCustomerSelected: (customer: Customer) => void;
}

export default function CustomerLookup({ onCustomerSelected }: CustomerLookupProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState<Customer[]>([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            setError('Please enter a search query');
            return;
        }

        setError('');
        setLoading(true);
        setResults([]);

        try {
            const data = await customerAPI.searchCustomers(searchQuery.trim());
            if (data.customers && data.customers.length > 0) {
                setResults(data.customers);
            } else {
                setError('No customers found matching your search');
            }
        } catch (err: any) {
            console.error('Search error:', err);
            setError(err.response?.data?.error || err.message || 'Customer not found');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <h2>Lookup Existing Customer</h2>
            <form onSubmit={handleSearch}>
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Enter Customer ID, Name, or Email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        required
                        style={{ padding: '0.5rem', width: '300px', marginRight: '0.5rem' }}
                    />
                    <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

            {results.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                    <h3>Search Results:</h3>
                    {results.map((customer) => (
                        <div
                            key={customer.customerId}
                            style={{
                                padding: '1rem',
                                border: '1px solid #ddd',
                                marginBottom: '0.5rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: '#f9f9f9',
                                color: '#1b5e20'
                            }}
                            onClick={() => onCustomerSelected(customer)}
                        >
                            <strong>{customer.firstName} {customer.lastName}</strong>
                            <br />
                            Email: {customer.email}
                            <br />
                            Customer ID: {customer.customerId}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
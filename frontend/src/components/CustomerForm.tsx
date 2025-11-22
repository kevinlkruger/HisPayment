import { useState } from 'react';
import { customerAPI } from '../services/api';

interface CustomerFormProps {
    onCustomerCreated: (customerId: string) => void;
}

export default function CustomerForm({ onCustomerCreated }: CustomerFormProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        paymentToken: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateToken = () => {
        const randomString = Math.random().toString(36).substring(2, 10);
        const token = `tok_${randomString}`;
        setFormData({ ...formData, paymentToken: token });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await customerAPI.createCustomer(formData);
            onCustomerCreated(response.customerId);
            // Reset form
            setFormData({ firstName: '', lastName: '', email: '', paymentToken: '' });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create customer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <h2>Create Customer</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                            style={{ marginLeft: '0.5rem', padding: '0.5rem', width: '200px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                            style={{ marginLeft: '0.5rem', padding: '0.5rem', width: '200px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            style={{ marginLeft: '0.5rem', padding: '0.5rem', width: '200px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        Payment Token:
                        <input
                            type="text"
                            value={formData.paymentToken}
                            onChange={(e) => setFormData({ ...formData, paymentToken: e.target.value })}
                            required
                            style={{ marginLeft: '0.5rem', padding: '0.5rem', width: '200px' }}
                        />
                    </label>
                    <button
                        type="button"
                        onClick={generateToken}
                        style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
                    >
                        Generate Token
                    </button>
                </div>

                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
                    {loading ? 'Creating...' : 'Create Customer'}
                </button>
            </form>
        </div>
    );
}
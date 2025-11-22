import { useState } from 'react';
import CustomerForm from './components/CustomerForm';
import TransactionForm from './components/TransactionForm';
import TransactionHistory from './components/TransactionHistory';
import './App.css';

function App() {
  const [customerId, setCustomerId] = useState<string>('');
  const [lastTransactionId, setLastTransactionId] = useState<string>('');
  const [lastTransactionStatus, setLastTransactionStatus] = useState<string>('');

  const handleCustomerCreated = (id: string) => {
    setCustomerId(id);
    setLastTransactionId('');
    setLastTransactionStatus('');
  };

  const handleTransactionCreated = (transactionId: string, status: string) => {
    setLastTransactionId(transactionId);
    setLastTransactionStatus(status);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>HisPayment - Payment Processor</h1>

      <CustomerForm onCustomerCreated={handleCustomerCreated} />

      {customerId && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#e8f5e9',
          border: '1px solid #4caf50',
          borderRadius: '4px',
          marginBottom: '2rem',
          color: '#1b5e20'
        }}>
          <strong>Customer Created!</strong>
          <br />
          Customer ID: {customerId}
        </div>
      )}

      {customerId && (
        <>
          <TransactionForm
            customerId={customerId}
            onTransactionCreated={handleTransactionCreated}
          />

          {lastTransactionId && (
            <div style={{
              padding: '1rem',
              backgroundColor: lastTransactionStatus === 'success' ? '#e8f5e9' : '#ffebee',
              border: `1px solid ${lastTransactionStatus === 'success' ? '#4caf50' : '#f44336'}`,
              borderRadius: '4px',
              marginBottom: '2rem',
              color: lastTransactionStatus === 'success' ? '#1b5e20' : '#b71c1c'
            }}>
              <strong>
                {lastTransactionStatus === 'success' ? 'Transaction Successful!' : 'Transaction Failed'}
              </strong>
              {lastTransactionId && (
                <>
                  <br />
                  Transaction ID: {lastTransactionId}
                </>
              )}
            </div>
          )}

          <TransactionHistory customerId={customerId} />
        </>
      )}
    </div>
  );
}

export default App;
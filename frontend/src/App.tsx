import { useState } from 'react';
import CustomerForm from './components/CustomerForm';
import CustomerLookup from './components/CustomerLookup';
import TransactionForm from './components/TransactionForm';
import TransactionHistory from './components/TransactionHistory';
import type { Customer } from './services/api';
import './App.css';

type View = 'home' | 'transaction' | 'history';

function App() {
  const [view, setView] = useState<View>('home');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [lastTransactionId, setLastTransactionId] = useState<string>('');
  const [lastTransactionStatus, setLastTransactionStatus] = useState<string>('');
  const [showLookup, setShowLookup] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  const handleCustomerCreated = (customerId: string) => {
    // Fetch full customer details
    setCustomer({
      customerId,
      firstName: '',
      lastName: '',
      email: '',
      paymentToken: '',
      createdAt: new Date().toISOString()
    } as Customer);
    setView('transaction');
    setLastTransactionId('');
    setLastTransactionStatus('');
  };

  const handleCustomerSelected = (selectedCustomer: Customer) => {
    setCustomer(selectedCustomer);
    setView('transaction');
    setShowLookup(false);
  };

  const handleTransactionCreated = (transactionId: string, status: string) => {
    setLastTransactionId(transactionId);
    setLastTransactionStatus(status);
  };

  const handleBackToHome = () => {
    setCustomer(null);
    setView('home');
    setShowLookup(false);
    setLastTransactionId('');
    setLastTransactionStatus('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, cursor: 'pointer' }} onClick={handleBackToHome}>
          HisPayment - Payment Processor
        </h1>
        {customer && (
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e8f5e9',
            borderRadius: '4px',
            border: '1px solid #4caf50',
            color: '#1b5e20'
          }}>
            <strong>Customer ID:</strong> {customer.customerId}
          </div>
        )}
      </div>

      {/* Home View */}
      {view === 'home' && (
        <div>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <button
              onClick={() => setShowLookup(false)}
              style={{
                padding: '1rem 2rem',
                marginRight: '1rem',
                fontSize: '1rem',
                backgroundColor: !showLookup ? '#4caf50' : '#f0f0f0',
                color: !showLookup ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              New Customer
            </button>
            <button
              onClick={() => setShowLookup(true)}
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                backgroundColor: showLookup ? '#4caf50' : '#f0f0f0',
                color: showLookup ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Lookup Customer
            </button>
          </div>

          {!showLookup ? (
            <CustomerForm onCustomerCreated={handleCustomerCreated} />
          ) : (
            <CustomerLookup onCustomerSelected={handleCustomerSelected} />
          )}
        </div>
      )}

      {/* Transaction View */}
      {view === 'transaction' && customer && (
        <div>
          <TransactionForm
            customerId={customer.customerId}
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

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => {
                setView('history');
                setHistoryKey(prev => prev + 1); // Force TransactionHistory to reload
              }}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              View Transaction History
            </button>
          </div>
        </div>
      )}

      {/* History View */}
      {view === 'history' && customer && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setView('transaction')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Back to Process Transactions
            </button>
          </div>
          <TransactionHistory key={historyKey} customerId={customer.customerId} />
        </div>
      )}
    </div>
  );
}

export default App;
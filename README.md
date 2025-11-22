# HisPayment - Mock Payment Processor

A full-stack payment processing system built with TypeScript, Node.js, Express, and React.

## Overview

HisPayment is a mock payment gateway that demonstrates core payment processing functionality including customer management, transaction processing, fraud detection, and API integration patterns.

## Features

- **Customer Management**: Create and retrieve customer profiles with payment tokens
- **Transaction Processing**: Process payments with authorization and validation
- **Duplicate Transaction Detection**: Prevents accidental duplicate transactions within 5-second window
- **Fraud Alert System**: Monitors and blocks suspicious transaction patterns (5+ transactions in 2 minutes)
- **Fraud Audit Trail**: Persistent logging of all fraud alerts for compliance and analysis
- **RESTful API**: Clean API design with proper error handling and validation
- **Persistent Storage**: JSON-based data storage for development/demo purposes
- **TypeScript**: Full type safety across frontend and backend
- **Comprehensive Testing**: Jest unit tests with 80/20 pass/fail validation

## Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- Crypto for UUID generation
- JSON file storage
- Jest for testing

**Frontend:**
- React with TypeScript
- Vite (build tool)
- Axios for API calls
- Modern component architecture

## Project Structure
```
HisPayment/
├── backend/
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── data/              # Storage utilities
│   │   ├── __tests__/         # Jest test files
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── validators.ts      # Input validation
│   │   └── server.ts          # Express app setup
│   ├── data/                  # JSON data files
│   │   ├── customers.json
│   │   ├── transactions.json
│   │   └── fraud-alerts.json  # Fraud audit log
│   └── jest.config.js         # Jest configuration
└── frontend/                  # React application
    ├── src/
    │   ├── components/        # React components
    │   ├── services/          # API integration
    │   └── App.tsx            # Main application
    └── vite.config.ts         # Vite configuration
```

## API Endpoints

### Customers
- `POST /customers` - Create a new customer
  - Validates email format and name characters
  - Returns unique customerId
- `GET /customers/:customerId` - Get customer details
  - Returns customer information and block status

### Transactions
- `POST /transactions` - Process a new transaction
  - Validates customer exists
  - Checks for duplicate transactions (5-second window)
  - Monitors fraud patterns (5 transactions per 2 minutes)
  - Returns transaction ID or error
- `GET /customers/:customerId/transactions` - Get customer transaction history
  - Returns all transactions for a customer

### Error Codes
- `400` - Bad request (missing/invalid fields)
- `404` - Customer not found
- `409` - Duplicate transaction detected
- `429` - Too many transactions (fraud block)

## Part 5: Advanced Features

### 1. Duplicate Transaction Detection
**Purpose:** Prevent accidental duplicate transactions from double-clicks or network retries

**Implementation:**
- Tracks transaction fingerprints: `${customerId}-${amount}-${currency}`
- Maintains in-memory cache with 5-second sliding window
- Returns 409 Conflict for duplicates
- Automatic cleanup of expired fingerprints

**Technical Approach:**
```typescript
// Hybrid system: fast in-memory tracking + persistent storage
const fingerprint = `${customerId}-${amount}-${currency}`;
if (recentTransactions.includes(fingerprint)) {
  return 409; // Duplicate detected
}
```

### 2. Fraud Alert & Blocking System
**Purpose:** Monitor and block suspicious transaction patterns in real-time

**Implementation:**
- Tracks transaction count per customer with 2-minute sliding window
- Blocks customer after 5 transactions in 2 minutes
- Logs all fraud alerts to `fraud-alerts.json` for audit trail
- Adds `blockedUntil` timestamp to customer record
- Persists across server restarts

**Technical Approach:**
```typescript
// Check actual saved transactions from database
const recentTransactions = getTransactionsByCustomerId(customerId)
  .filter(t => withinLastTwoMinutes(t.timestamp));

if (recentTransactions.length >= 5) {
  // Block customer and log fraud alert
  updateCustomer({ blockedUntil: Date.now() + 120000 });
  saveFraudAlert({ customerId, count, timestamp });
  return 429; // Too Many Requests
}
```

**Fraud Alert Log Structure:**
```json
{
  "alertId": "uuid",
  "customerId": "customer-id",
  "transactionCount": 6,
  "timeWindow": "2 minutes",
  "timestamp": "2025-11-21T19:30:00Z",
  "blockedUntil": "2025-11-21T19:32:00Z"
}
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Running

1. Clone the repository:
```bash
git clone 
cd HisPayment
```

2. Start the backend:
```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:3001`

3. Start the frontend (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

4. Open your browser to `http://localhost:5173`

### Running Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

**Test Results:**
- 10 total tests (8 passing scenarios, 2 failing scenarios)
- 80/20 pass/fail ratio validates error handling
- Tests cover customer validation, duplicate detection, and fraud scenarios

## Usage Example

### Create a Customer
1. Fill in customer form (First Name, Last Name, Email)
2. Click "Generate Token" to create payment token
3. Click "Create Customer"
4. Customer ID will be displayed

### Process a Transaction
1. Enter transaction amount
2. Select currency (USD, EUR, GBP)
3. Click "Process Transaction"
4. Transaction result displayed with transaction ID

### View Transaction History
1. Click "View Transaction History"
2. All transactions for current customer displayed in table

### Test Fraud Detection
1. Create a customer
2. Rapidly process 5 transactions
3. 6th transaction will be blocked with error message
4. Check backend terminal for fraud alert log
5. Check `backend/data/fraud-alerts.json` for audit trail

## Design Decisions

### Why JSON Storage?
- Simplifies demo without database setup
- Easy to inspect and debug data
- Demonstrates persistence concepts
- Production system would use PostgreSQL/MySQL with Prisma

### Why TypeScript?
- Type safety reduces runtime errors
- Better IDE support and autocomplete
- Easier refactoring and maintenance
- Industry standard for modern Node.js/React

### Why Hybrid Fraud Detection?
- **In-memory tracking**: Fast performance for real-time checks
- **Database validation**: Accurate count from persistent storage
- **Persistent blocking**: Survives server restarts
- **Audit logging**: Compliance and analysis requirements

### API Design Principles
- RESTful conventions
- Proper HTTP status codes (200, 201, 400, 404, 409, 429)
- Clear, actionable error messages
- Consistent response format

## Development Timeline

This project was developed following an agile sprint methodology over a 5-hour timeline:
- **Sprint 1**: Project setup and infrastructure (1 hour)
- **Sprint 2**: Backend API development (1.5 hours)
- **Sprint 3**: Frontend development (1.5 hours)
- **Sprint 4**: Testing & Part 5 features (1 hour)
- **Sprint 5**: Documentation & polish (30 minutes)

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for detailed sprint breakdown and [HisPaymentTesting.md](HisPaymentTesting.md) for testing strategy.

## Future Enhancements

- Database integration (PostgreSQL/MySQL via Prisma)
- Authentication and authorization (JWT tokens)
- Webhook support for async notifications
- Machine learning-based fraud detection
- PCI compliance features for production use
- Payment method diversity (cards, ACH, crypto)
- Rate limiting and security headers
- Cloud deployment (AWS/GCP)
- Real-time dashboard for fraud monitoring
- Customer risk scoring system

## AI Tool Usage

This project was developed with assistance from Claude (Anthropic's AI assistant) for:
- Architecture planning and best practices
- Code generation and debugging
- TypeScript configuration troubleshooting
- Test case design

## Author

Kevin - Software Developer

---

**Note**: This is a demonstration project for educational purposes. Not suitable for production use without significant security enhancements, database integration, and PCI compliance implementation.

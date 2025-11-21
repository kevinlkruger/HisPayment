# HisPayment - Mock Payment Processor

A full-stack payment processing system built with TypeScript, Node.js, Express, and React.

## Overview

HisPayment is a mock payment gateway that demonstrates core payment processing functionality including customer management, transaction processing, and API integration patterns.

## Features

- **Customer Management**: Create and retrieve customer profiles with payment tokens
- **Transaction Processing**: Process payments with authorization and validation
- **RESTful API**: Clean API design with proper error handling and validation
- **Persistent Storage**: JSON-based data storage for development/demo purposes
- **TypeScript**: Full type safety across frontend and backend

## Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- UUID for ID generation
- JSON file storage

**Frontend:**
- React with TypeScript
- Axios for API calls
- Modern component architecture

## Project Structure
```
HisPayment/
├── backend/
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── data/          # Storage utilities
│   │   ├── types.ts       # TypeScript interfaces
│   │   ├── validators.ts  # Input validation
│   │   └── server.ts      # Express app setup
│   └── data/              # JSON data files
└── frontend/              # React application
    ├── src/
    │   ├── components/    # React components
    │   ├── services/      # API integration
    │   └── types/         # TypeScript types
    └── public/            # Static assets
```

## API Endpoints

### Customers
- `POST /customers` - Create a new customer
- `GET /customers/:customerId` - Get customer details

### Transactions
- `POST /transactions` - Process a new transaction
- `GET /customers/:customerId/transactions` - Get customer transaction history

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Running

1. Clone the repository:
```bash
git clone <your-repo-url>
cd HisPayment
```

2. Start the backend:
```bash
cd backend
npm install
npm run dev
```

3. Start the frontend (in a new terminal):
```bash
cd frontend
npm install
npm start
```

4. Open your browser to `http://localhost:3000`

## Development Approach

This project was developed following an agile sprint methodology over a 5-hour timeline. See [PROJECT_PLAN.md](PROJECT_PLAN.md) for detailed sprint breakdown and implementation decisions.

## Future Enhancements

- Database integration (PostgreSQL/MySQL)
- Authentication and authorization
- Webhook support for async notifications
- Enhanced fraud detection
- PCI compliance features
- Payment method diversity (cards, ACH, etc.)

## Author

Kevin - Software Developer

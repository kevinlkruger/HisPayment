# HisPayment Project Timeline

**Total Estimated Time:** 4-5 hours  
**Note:** Work efficiently - some tasks will need to be completed quickly

---

## Sprint 1: Project Setup (1 hour)

### 1.1 Initialize Repository (15 min)
- [ ] Create GitHub repository: `hispayment-mock-gateway`
- [ ] Initialize with README.md
- [ ] Create .gitignore for Node.js
- [ ] Initial commit

### 1.2 Backend Structure (25 min)
- [ ] Create `/backend` folder
- [ ] Initialize Node.js project: `npm init -y`
- [ ] Install dependencies:
  - `express`, `cors`, `uuid`
  - `typescript`, `@types/node`, `@types/express`, `tsx`
- [ ] Create `tsconfig.json`
- [ ] Create folder structure:
  ```
  /backend
    /src
      server.ts
      /routes
        customers.ts
      /data
        storage.ts
      /types.ts
      /validators.ts
    /data
      customers.json
      transactions.json
  ```
- [ ] Add npm scripts: `"dev": "tsx src/server.ts"`

### 1.3 Frontend Structure (20 min)
- [ ] Create `/frontend` folder
- [ ] Initialize Vite React: `npm create vite@latest frontend -- --template react-ts`
- [ ] Install dependencies: `axios`
- [ ] Create folder structure:
  ```
  /frontend
    /src
      App.tsx
      /components
        CustomerForm.tsx
        CustomerLookup.tsx
        TransactionForm.tsx
        TransactionHistory.tsx
      /services
        api.ts
  ```

**Commit:** "Project setup complete - backend and frontend initialized"

---

## Sprint 2: Backend Development (1.5 hours)

### 2.1 Setup Server & JSON Storage (20 min)
- [ ] Configure Express server in `server.ts`
- [ ] Add CORS middleware
- [ ] Create JSON file read/write utility functions in `storage.ts`
- [ ] Initialize empty `customers.json` and `transactions.json`
- [ ] Test server starts on port 3001

### 2.2 Customer Endpoint (30 min)
- [ ] Define TypeScript types/interfaces for Customer
- [ ] Create validation utility:
  - Email format validation (must have @ and .)
  - Name validation (no special characters: `%$#@&^*()!`)
- [ ] Implement POST `/customers`:
  - Validate input
  - Generate unique customer ID with UUID
  - Save to customers.json
  - Return 200 with customerId or 400 with error
- [ ] Test endpoint with curl

### 2.3 Transaction Endpoint (30 min)
- [ ] Define TypeScript types for Transaction
- [ ] Implement POST `/transactions`:
  - Validate customer exists (404 if not)
  - Mock 80/20 success/failure: `Math.random() > 0.2`
  - Generate transaction ID with UUID
  - Add timestamp
  - Save to transactions.json
  - Return appropriate status codes
- [ ] Test with valid/invalid data

### 2.4 Data Retrieval Endpoints (15 min)
- [ ] Implement GET `/customers/search?query=`:
  - Search by customer ID (exact), email (exact), or name (partial)
  - Case-insensitive matching
  - Return array of matching customers (404 if none found)
  - **IMPORTANT:** Define this route BEFORE `/:customerId` to avoid route conflicts
- [ ] Implement GET `/customers/:customerId`:
  - Validate customer exists (404 if not)
  - Return customer details
- [ ] Implement GET `/customers/:customerId/transactions`:
  - Validate customer exists (404 if not)
  - Retrieve all transactions for customer
  - Return transaction array

**Commit:** "Backend API complete - all endpoints working"

---

## Sprint 3: Frontend Development (1.5 hours)

### 3.1 Setup API Service (15 min)
- [ ] Create Axios instance in `api.ts`
- [ ] Configure base URL: `http://localhost:3001`
- [ ] Create API functions:
  - `createCustomer()`
  - `searchCustomers(query)` - NEW: Search by ID, name, or email
  - `getCustomer()`
  - `processTransaction()`
  - `getCustomerTransactions()`
- [ ] Define TypeScript types for API requests/responses

### 3.2 Customer Form Component (20 min)
- [ ] Create `CustomerForm.tsx`:
  - Input fields: firstName, lastName, email
  - Form validation (required fields, email format)
  - Generate fake payment token button: `tok_${randomString}`
  - Display generated token
  - TypeScript types for form state

### 3.3 Customer Lookup Component (20 min)
- [ ] Create `CustomerLookup.tsx`:
  - Search input field (ID, name, or email)
  - Submit button triggers search API call
  - Display search results as clickable cards
  - On click: select customer and proceed to transactions
  - Loading and error states
  - Clear, readable styling

### 3.4 Transaction Form Component (25 min)
- [ ] Create `TransactionForm.tsx`:
  - Amount input (dollars, convert to cents)
  - Currency dropdown (USD, EUR, GBP)
  - Submit button
  - Loading state during submission
  - Form validation before submit
  - Handle API errors
  - Display success/failure messages inline with transaction ID

### 3.5 Transaction History Component (20 min)
- [ ] Create `TransactionHistory.tsx`:
  - Auto-fetch transactions on component mount (useEffect)
  - Display transactions in table format
  - Show: transaction ID, amount, currency, status, timestamp
  - Color-code status (green for success, red for failed)
  - Handle empty state (no transactions)
  - Handle errors
  - Loading state during fetch

### 3.6 Wire Everything Together (20 min)
- [ ] In `App.tsx`:
  - View state management: 'home' | 'transaction' | 'history'
  - Home view: Toggle between "New Customer" and "Lookup Customer"
  - Transaction view: Display customer ID in header, process transactions, button to view history
  - History view: Auto-loads transaction history, button back to transactions
  - Use `key` prop on TransactionHistory to force reload on view change
  - Handle loading states throughout
  - Display transaction results inline
- [ ] Add basic inline CSS for layout (keep simple)

**Commit:** "Frontend complete - form to API integration working"

---

## Sprint 4: Testing & Part 5 Implementation (1 hour)

### 4.1 Setup Jest (10 min)
- [ ] Install Jest: `npm install --save-dev jest ts-jest @types/jest`
- [ ] Create `jest.config.js`
- [ ] Add test script: `"test": "jest"`

### 4.2 Write Customer Endpoint Tests (25 min)
- [ ] Create `tests/customers.test.ts`
- [ ] Implement 10 tests from HisPaymentTesting.md:
  - 8 passing tests (valid scenarios)
  - 2 failing tests (invalid name, invalid email)
- [ ] Mock JSON file operations
- [ ] Run tests: `npm test`

### 4.3 Part 5 Architecture Features (25 min)

**Feature 1: Customer Search/Lookup (10 min)**
- [ ] Implement GET `/customers/search` endpoint
- [ ] Search by customer ID (exact), email (exact), or name (partial, case-insensitive)
- [ ] Create frontend CustomerLookup component
- [ ] Display search results as clickable cards
- [ ] Allow selecting customer to proceed with transactions

**Feature 2: Duplicate Transaction Detection (10 min)**
- [ ] Implement 5-second duplicate detection in transaction endpoint
- [ ] Store transaction fingerprints: `${customerId}-${amount}-${currency}`
- [ ] Return 409 Conflict for duplicates within 5 seconds
- [ ] Add test cases for duplicate detection

**Feature 3: Fraud Alert System (5 min)**
- [ ] Track transaction count per customer (sliding 1-minute window)
- [ ] Trigger alert when 10+ transactions in 1 minute
- [ ] Log fraud alert to console
- [ ] Add `fraudAlert: true` flag to transaction metadata
- [ ] Add test cases for fraud detection

**Commit:** "Unit tests and Part 5 features complete"

---

## Sprint 5: Documentation & Polish (30 min)

### 5.1 Complete README.md (20 min)
- [ ] Setup Instructions:
  - Prerequisites (Node.js version)
  - Installation steps for backend and frontend
  - How to run locally
- [ ] API Documentation:
  - Document all endpoints
  - Request/response examples
  - Error codes
- [ ] Part 5 Implementation:
  - Explain duplicate transaction detection
  - Explain fraud alert system
  - Design rationale
- [ ] Design Decisions:
  - Tech stack choices
  - JSON file storage rationale
- [ ] Assumptions Made:
  - Amount format (cents vs dollars)
  - Customer creation strategy
  - Fraud detection thresholds
- [ ] Future Improvements:
  - Real database integration
  - Authentication
  - Webhook notifications
- [ ] AI Tool Usage:
  - Mention Claude usage
- [ ] Link to HisPaymentTesting.md

### 5.2 Final Testing & Cleanup (10 min)
- [ ] Test entire flow end-to-end locally
- [ ] Clean up console.logs
- [ ] Check for TypeScript errors
- [ ] Verify .gitignore (node_modules excluded)

**Commit:** "Documentation complete - ready for submission"

---

## Sprint 6: Final Review & Submission (15 min)

### 6.1 Pre-Submission Checklist
- [ ] All API endpoints working
- [ ] Frontend form submits successfully
- [ ] Tests pass (8 pass, 2 fail as designed)
- [ ] Part 5 features implemented and tested
- [ ] README has all required sections
- [ ] Multiple meaningful commits in git history
- [ ] No sensitive data in repository
- [ ] Code is clean and readable

### 6.2 Submission
- [ ] Push final commit to GitHub
- [ ] Make repository public
- [ ] Test clone and run on clean machine (if possible)
- [ ] Prepare submission notes:
  - GitHub link
  - Time spent: ~5 hours
  - Challenges faced
  - Part 5 implementation highlights

**Final Commit:** "Ready for submission - all requirements met"

---

## Summary by Phase

| Phase | Time | Key Deliverables |
|-------|------|-----------------|
| **Setup** | 1 hour | Project structure, dependencies installed |
| **Backend** | 1.5 hours | All API endpoints, JSON storage |
| **Frontend** | 1.5 hours | React UI, API integration, transaction history |
| **Testing & Part 5** | 1 hour | Jest setup, 10+ tests, duplicate detection, fraud alerts |
| **Documentation** | 30 min | Complete README, testing docs |
| **Review** | 15 min | Final testing, submission prep |
| **TOTAL** | **5 hours** | Full-stack payment processor with advanced features |

---

## Tips for Success

1. **Commit frequently** - After each sprint or major milestone
2. **Test as you go** - Don't wait until the end to test endpoints
3. **Keep it simple** - Working > perfect
4. **Use AI tools** - Let Claude help with boilerplate
5. **Time-box** - If a task is taking too long, move on and document in README

---

## Part 5 Implementation Notes

**Why these 3 features?**
- **Customer Search:** Essential UX feature for returning customers - demonstrates understanding of user workflows
- **Duplicate Detection:** Common real-world problem in payment processing (double-clicks, network retries)
- **Fraud Alerts:** Demonstrates understanding of monitoring/alerting patterns without over-engineering

All three features showcase production-ready thinking while staying within time constraints.

**Remember:** The goal is demonstrating your skills, not perfection. Ship something that works!

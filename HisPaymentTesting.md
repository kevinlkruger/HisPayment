# HisPayment Testing Documentation

## Testing Strategy

This document outlines the unit testing approach for the Payment Gateway Mock Integration project. Tests are designed to validate core functionality, error handling, and edge cases.

---

## Testing Framework

- **Framework:** Jest (JavaScript/TypeScript testing framework - similar to MSTest/NUnit for C#)
- **Language:** TypeScript
- **Coverage Target:** 80% pass rate, 20% fail rate for error handling validation

---

## Core Customer Endpoint Tests (10 Total)

### Passing Tests (8 - 80%)

1. **Valid customer creation**
   - Input: Valid firstName, lastName, email, paymentToken
   - Expected: 200 status + customerId returned

2. **Valid customer with all fields**
   - Input: Complete customer object with all required fields
   - Expected: 200 status + customerId returned

3. **Customer with different valid email formats**
   - Input: Various valid email formats (e.g., name+tag@domain.com)
   - Expected: 200 status + customerId returned

4. **Customer with uppercase email**
   - Input: Email with uppercase characters
   - Expected: 200 status + customerId returned (email normalized)

5. **Customer with hyphenated last name**
   - Input: lastName with hyphens (e.g., "Smith-Johnson")
   - Expected: 200 status + customerId returned

6. **Customer with long payment token**
   - Input: Payment token with extended length
   - Expected: 200 status + customerId returned

7. **Customer with minimum valid data**
   - Input: Only required fields, no optional data
   - Expected: 200 status + customerId returned

8. **Customer generates unique IDs**
   - Input: Multiple valid customer creations
   - Expected: Each returns unique customerId

### Failing Tests (2 - 20%)

9. **Invalid name with special characters**
   - Input: firstName or lastName contains special characters (`%$#@&^*()!`)
   - Expected: 400 status + error message "Name fields cannot contain special characters"

10. **Invalid email format**
    - Input: Email missing "@" symbol (e.g., "notanemail") OR missing "." after @ (e.g., "name@domain")
    - Expected: 400 status + error message "Invalid email format"

---

## Additional Architecture Tests (Part 5 Implementation)

These tests demonstrate system design thinking and address scalability, concurrency, and fraud detection.

### 1. Customer Search/Lookup

**Purpose:** Allow searching for existing customers by ID, name, or email before creating transactions

**Implementation:**
- GET `/customers/search?query={searchTerm}`
- Searches across: customerId (exact match), email (exact match), firstName, lastName (partial match)
- Returns array of matching customers
- 404 if no matches found

**Technical Approach:**
- Case-insensitive search
- Supports full name search: "John Doe"
- Route must be defined BEFORE `/:customerId` route to avoid conflicts

### 2. Duplicate Transaction Detection

**Purpose:** Prevent accidental duplicate transactions from double-clicks or network retries

**Implementation:**
- ❌ Same customer, same amount, within 5 seconds - should reject duplicate (409 Conflict)
- ✅ Same customer, same amount, after 5 seconds - should allow (200)

**Technical Approach:**
- Store recent transaction fingerprints in memory with timestamps
- Fingerprint: `${customerId}-${amount}-${currency}`
- Clean up fingerprints older than 5 seconds

### 3. Fraud Alert Notification System

**Purpose:** Monitor and flag suspicious transaction patterns in real-time

**Implementation:**
- ⚠️ **Alert Trigger:** 10+ transactions from same customer within 1 minute
- **Action:** 
  - Transaction is allowed but flagged for review
  - Logs fraud alert to console
  - Sends notification (webhook simulation or console log)
  - Adds `fraudAlert: true` flag to transaction metadata

**Technical Approach:**
- Track transaction count per customer with sliding 1-minute window
- When threshold exceeded, trigger alert but don't block transaction
- Clear/reset counters after 1 minute

---

## Test Execution

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test Suite
```bash
npm test -- customer.test.ts
npm test -- transactions.test.ts
```

---

## Success Criteria

- ✅ All 10 core customer endpoint tests pass
- ✅ 80% pass rate / 20% fail rate maintained
- ✅ Error responses include clear, actionable messages
- ✅ Edge cases handled gracefully
- ✅ Customer search/lookup working (by ID, name, or email)
- ✅ Duplicate transaction detection working
- ✅ Fraud alert system triggers correctly

---

## Notes

- Tests use mocked data storage (no real file I/O during tests)
- Random 80/20 success/failure in transactions is mocked for deterministic testing
- Part 5 features demonstrate production-ready thinking without over-engineering
- Architecture tests showcase understanding of payment processor requirements

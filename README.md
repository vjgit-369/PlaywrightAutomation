# Playwright E2E Testing Framework

This repository contains an end-to-end testing framework built with Playwright and Cucumber, demonstrating automated testing of an e-commerce application.

## Features

- E2E Shopping Flow Tests
- Page Object Model Implementation
- Test Data Management
- Error Screenshots
- HTML Reports
- Cucumber BDD Integration

## Test Structure

- `tests/e2e/` - End-to-end test scenarios
- `pageobjects/` - Page Object Model classes
- `test-data/` - Test data and scenarios
- `features/` - Cucumber feature files and step definitions

## Setup

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/e2e/ShoppingTest.spec.js

# Run with UI
npx playwright test --headed
```

## Reports

Test reports are generated in the `playwright-report` directory.

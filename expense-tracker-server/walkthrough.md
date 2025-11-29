# Expense Tracker Backend Migration Walkthrough

## Overview
I have successfully migrated the backend logic to a NestJS application. The server is configured to run on port 5000 and uses PostgreSQL with Prisma ORM.

## Features Implemented
- **Database Schema**: Defined in `prisma/schema.prisma` covering Users, Categories, Expenses, Loans, Splits, and Summaries.
- **Modules**:
  - **Users**: User management with soft delete (`isDeleted`, `deletedAt`).
  - **Categories**: Category management with hierarchy support.
  - **Expenses**: Core expense tracking with filtering and soft delete.
  - **Loans**: Loan management with payment tracking and status updates.
  - **Splits**: Split expense management with participants and settlement logic.
  - **Summaries**: Monthly and yearly summary calculations.
- **Architecture**:
  - **DTOs**: Data Transfer Objects with validation using `class-validator`.
  - **Services**: Business logic layer.
  - **Controllers**: API endpoints.
  - **Global Validation**: Enabled globally in `main.ts`.
  - **CORS**: Enabled for frontend integration.

## How to Run
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Database Setup**:
    Ensure your PostgreSQL database is running. The connection string is in `.env`.
    ```bash
    npx prisma generate
    npx prisma db push
    ```
3.  **Start Server**:
    ```bash
    npm run start:dev
    ```
    The server will start at `http://localhost:5000/api`.

## API Endpoints
- **Users**: `GET /api/users`, `POST /api/users`, etc.
- **Categories**: `GET /api/categories`, `POST /api/categories`
- **Expenses**: `GET /api/expenses`, `POST /api/expenses`
- **Loans**: `GET /api/loans`, `POST /api/loans`, `POST /api/loans/:id/payments`
- **Splits**: `GET /api/split-expenses`, `POST /api/split-expenses`
- **Summaries**: `GET /api/summaries/monthly`, `GET /api/summaries/yearly`

## Notes
- I used **Prisma 5** instead of Prisma 7 to ensure stability and compatibility with the current NestJS setup.
- The application uses `api` as the global prefix.
- Soft delete is implemented for Users and Expenses.

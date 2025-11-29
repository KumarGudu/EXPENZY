# Implementation Plan - Expense Tracker Backend Migration

## Goal
Migrate backend logic from Next.js to a production-ready NestJS server using Postgres and Prisma.

## User Review Required
- [ ] Database Schema: Confirming the schema matches the requirements (User, Expense, Loan, Split, Category, etc.)
- [ ] Soft Delete: Implementing `isDeleted` and `deletedAt` for Users as requested.

## Proposed Changes

### Configuration
#### [NEW] .env
- Set `DATABASE_URL`
- Set `PORT=5000`

### Database (Prisma)
#### [NEW] prisma/schema.prisma
- Define models: User, Category, Expense, RecurringPattern, SplitExpense, SplitParticipant, Loan, LoanPayment, Budget, MonthlySummary, YearlySummary, Notification, AuditLog, ExchangeRate, Attachment.
- Add relations and indexes.

### Modules

#### Common
- Global Validation Pipe
- Global Exception Filter
- Prisma Service (Database connection)

#### Users
- `users.module.ts`
- `users.controller.ts`
- `users.service.ts`
- DTOs: CreateUserDto, UpdateUserDto

#### Categories
- `categories.module.ts`
- `categories.controller.ts`
- `categories.service.ts`

#### Expenses
- `expenses.module.ts`
- `expenses.controller.ts`
- `expenses.service.ts`

#### Loans
- `loans.module.ts`
- `loans.controller.ts`
- `loans.service.ts`

#### Splits
- `splits.module.ts`
- `splits.controller.ts`
- `splits.service.ts`

## Verification Plan
### Automated Tests
- Run `npm run start:dev` to ensure server starts on port 5000.
- Use `curl` to test endpoints.

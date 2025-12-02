# EXPENZY Project File Structure

This document provides an overview of the EXPENZY project structure to help AI understand the purpose of each file/directory and prevent code duplication.

## Project Overview
- **Frontend**: Next.js 14+ (App Router) with TypeScript, React Query, and Tailwind CSS
- **Backend**: NestJS with Prisma ORM (located in `../expense-tracker-server`)

---

## 📁 Core Directories

### `/app` - Next.js App Router Pages
All route-based pages using Next.js 14+ App Router pattern.

- **`/app/api/auth/`** - NextAuth.js authentication API routes
- **`/app/dashboard/`** - Main dashboard pages (protected routes)
  - `page.tsx` - Dashboard home/overview page
  - `layout.tsx` - Shared dashboard layout with sidebar/header
  - `/transactions/page.tsx` - Transaction list with filters & pagination
  - `/budget/page.tsx` - Budget management
  - `/analytics/page.tsx` - Analytics & insights
  - `/loans/page.tsx` - Loan tracking
  - `/groups/page.tsx` - Group expense splitting
  - `/savings/page.tsx` - Savings goals
  - `/subscriptions/page.tsx` - Recurring subscriptions
  - `/accounts/page.tsx` - Account management
  - `/payment-methods/page.tsx` - Payment method management
  - `/tags/page.tsx` - Tag organization
  - `/notifications/page.tsx` - Notification center
  - `/profile/page.tsx` - User profile & settings
- **`/app/login/`** - Login page (public)
- **`/app/signup/`** - Signup page (public)
- **`/app/globals.css`** - Global styles & Tailwind imports

---

### `/components` - React Components
Organized by component type for reusability.

#### `/components/features/` - Feature-Specific Components
Complex components tied to specific features:
- `expense-modal.tsx` - Expense creation/edit modal
- `income-modal.tsx` - Income creation/edit modal
- `/profile/*` - Profile page sections (security, appearance, notifications, etc.)

#### `/components/layout/` - Layout Components
Shared layout elements used across pages:
- `desktop-sidebar.tsx` - Desktop navigation sidebar
- `desktop-header.tsx` - Desktop top header
- `mobile-header.tsx` - Mobile top header
- `bottom-nav.tsx` - Mobile bottom navigation
- `page-header.tsx` - Reusable page title/breadcrumb header

#### `/components/modals/` - Reusable Modals
All modal dialogs for CRUD operations:
- `add-transaction-modal.tsx` - Add transaction (income/expense)
- `transaction-modal.tsx` - View/edit transaction details
- `add-budget-modal.tsx` - Create budget
- `add-loan-modal.tsx` - Create loan
- `add-group-modal.tsx` - Create group
- `add-savings-goal-modal.tsx` - Create savings goal
- `add-subscription-modal.tsx` - Create subscription
- `edit-profile-modal.tsx` - Edit user profile
- `change-password-modal.tsx` - Change password
- `delete-account-modal.tsx` - Account deletion confirmation
- `confirmation-modal.tsx` - Generic confirmation dialog

#### `/components/shared/` - Shared Utility Components
Reusable components used across multiple features:
- `glass-card.tsx` - Glassmorphism styled card wrapper
- `stat-card.tsx` - Dashboard statistics card
- `empty-state.tsx` - Empty state placeholder
- `loading-skeleton.tsx` - Loading skeleton states
- `virtual-list.tsx` - Infinite scroll/virtual list with pagination

#### `/components/ui/` - Shadcn UI Components
Base UI components from shadcn/ui (DO NOT MODIFY directly, regenerate via CLI):
- `button.tsx`, `input.tsx`, `select.tsx`, etc.
- `dialog.tsx`, `sheet.tsx` - Modal/drawer primitives
- `form.tsx` - React Hook Form integration
- `data-table.tsx` - Table component

---

### `/lib` - Utilities, Hooks, and Configuration
Core business logic and helpers.

#### `/lib/api/` - API Layer
- `client.ts` - Axios instance with auth interceptors
- `endpoints.ts` - API endpoint constants

#### `/lib/hooks/` - React Query Hooks
Custom hooks for data fetching (ALWAYS USE THESE, don't create new API calls):
- `use-expenses.ts` - Expense CRUD & pagination
- `use-income.ts` - Income CRUD & pagination
- `use-budget.ts` - Budget operations
- `use-loans.ts` - Loan operations
- `use-groups.ts` - Group operations
- `use-savings.ts` - Savings goal operations
- `use-subscriptions.ts` - Subscription operations
- `use-accounts.ts` - Account operations
- `use-payment-methods.ts` - Payment method operations
- `use-categories.ts` - Category fetching
- `use-tags.ts` - Tag operations
- `use-analytics.ts` - Analytics data
- `use-notifications.ts` - Notifications
- `use-profile.ts` - User profile operations
- `use-settings.ts` - User settings

#### `/lib/utils/` - Utility Functions
Pure helper functions (REUSE these, don't duplicate):
- `cn.ts` - Class name merger (tailwind-merge + clsx)
- `currency.ts` - Currency formatting
- `format.ts` - Date/number formatting
- `transaction-helpers.ts` - Transaction-specific helpers

#### `/lib/validations/` - Zod Schemas
Form validation schemas (ALWAYS USE for forms):
- `schemas.ts` - Main validation schemas (budget, loan, transaction, etc.)
- `auth.ts` - Auth schemas (login, signup)
- `profile.schema.ts` - Profile update schemas
- `savings.schema.ts` - Savings goal schemas
- `subscription.schema.ts` - Subscription schemas

#### `/lib/config/`
- `query-client.ts` - React Query configuration

#### `/lib/`
- `routes.ts` - Route constants
- `utils.ts` - General utilities

---

### `/types` - TypeScript Type Definitions
Centralized type definitions (ALWAYS IMPORT from here):
- `index.ts` - Re-exports all types
- `expense.ts` - Expense & transaction types
- `income.ts` - Income types
- `budget.ts` - Budget types
- `loan.ts` - Loan types
- `group.ts` - Group & split types
- `savings-goal.ts` - Savings goal types
- `subscription.ts` - Subscription types
- `account.ts` - Account types
- `payment-method.ts` - Payment method types
- `category.ts` - Category types
- `tag.ts` - Tag types
- `user.ts` - User & profile types
- `analytics.ts` - Analytics types
- `notification.ts` - Notification types
- `auth.ts` - Auth types
- `api.ts` - API response types

---

### `/contexts` - React Context Providers
Global state management:
- Auth context
- Theme context
- User preferences context

---

### `/public` - Static Assets
Images, icons, fonts (accessible via `/filename.ext` in code)

---

## 🎨 Styling Files

- **`/app/globals.css`** - Global styles, CSS variables, Tailwind directives
- **`/theme.css`** (root level) - Theme color tokens
- **`/theme.md`** (root level) - Theme documentation

---

## 📝 Configuration Files

- **`next.config.ts`** - Next.js configuration
- **`tailwind.config.ts`** - Tailwind CSS configuration
- **`tsconfig.json`** - TypeScript configuration
- **`components.json`** - Shadcn UI configuration
- **`.env.local`** - Environment variables (NEVER commit)

---

## 🔧 Backend Structure (`../expense-tracker-server`)

### `/src` - NestJS Source Code
- **`/src/auth/`** - Authentication module (JWT, guards)
- **`/src/users/`** - User management
- **`/src/expenses/`** - Expense endpoints
- **`/src/income/`** - Income endpoints
- **`/src/categories/`** - Category endpoints
- **`/src/budgets/`** - Budget endpoints
- **`/src/loans/`** - Loan endpoints
- **`/src/groups/`** - Group & split endpoints
- **`/src/savings-goals/`** - Savings goal endpoints
- **`/src/subscriptions/`** - Subscription endpoints
- **`/src/accounts/`** - Account endpoints
- **`/src/payment-methods/`** - Payment method endpoints
- **`/src/notifications/`** - Notification endpoints
- **`/src/analytics/`** - Analytics endpoints

### `/prisma` - Database
- **`schema.prisma`** - Database schema (Prisma ORM)
- **`/migrations/`** - Database migration history

---

## 🚨 Important Rules for AI

### 1. **ALWAYS Reuse Existing Code**
- Check `/lib/hooks/` before creating new API calls
- Check `/lib/utils/` before creating new helper functions
- Check `/types/` before defining new types
- Check `/components/shared/` before creating new reusable components

### 2. **Component Hierarchy**
- Use `/components/ui/` for base primitives (shadcn)
- Use `/components/shared/` for reusable business components
- Use `/components/features/` for page-specific complex components
- Use `/components/modals/` for all modal dialogs
- Use `/components/layout/` for navigation/layout

### 3. **Data Fetching**
- **ALWAYS** use existing hooks from `/lib/hooks/`
- **NEVER** call API directly from components
- Use React Query for all server state

### 4. **Form Validation**
- **ALWAYS** use Zod schemas from `/lib/validations/`
- **NEVER** create inline validation

### 5. **Styling**
- Use Tailwind utility classes
- Use theme CSS variables from `globals.css`
- For reusable styles, use `/components/shared/` components like `glass-card.tsx`

### 6. **Type Safety**
- Import types from `/types/`
- Never use `any` type
- Use proper TypeScript generics

### 7. **Database Changes**
- Modify `prisma/schema.prisma` in backend
- Run `npx prisma generate` and `npx prisma migrate dev --name init`
- Update corresponding types in frontend `/types/`

---

## 🔄 Common Workflows

### Adding a New Feature Page
1. Create page in `/app/dashboard/[feature]/page.tsx`
2. Create types in `/types/[feature].ts`
3. Create hook in `/lib/hooks/use-[feature].ts`
4. Create modals in `/components/modals/add-[feature]-modal.tsx`
5. Create backend module in `../expense-tracker-server/src/[feature]/`

### Adding a New Reusable Component
1. Determine type: UI (`/ui/`), shared (`/shared/`), or feature (`/features/`)
2. Check if similar component exists
3. Create with proper TypeScript types
4. Export and document props

### Modifying Forms
1. Update Zod schema in `/lib/validations/`
2. Update types in `/types/`
3. Update modal component
4. Update hook mutation
5. Update backend DTO

---

## 📦 Key Dependencies

### Frontend
- **Next.js 14+** - React framework (App Router)
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components
- **NextAuth.js** - Authentication
- **Axios** - HTTP client

### Backend
- **NestJS** - Node.js framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Class Validator** - DTO validation

---

## 📌 Quick Reference

| Task | Location | Key Files |
|------|----------|-----------|
| Add API endpoint | Backend `/src/[module]/` | `controller.ts`, `service.ts`, `dto.ts` |
| Fetch data | `/lib/hooks/` | `use-[feature].ts` |
| Add modal | `/components/modals/` | `add-[feature]-modal.tsx` |
| Validate form | `/lib/validations/` | `schemas.ts` or `[feature].schema.ts` |
| Format data | `/lib/utils/` | `format.ts`, `currency.ts` |
| Define types | `/types/` | `[feature].ts` |
| Create page | `/app/dashboard/[feature]/` | `page.tsx` |
| Add shared component | `/components/shared/` | `[component-name].tsx` |
| Update styles | `/app/globals.css` | Global CSS variables |

---

**Last Updated**: December 2025  
**Maintainer**: EXPENZY Team

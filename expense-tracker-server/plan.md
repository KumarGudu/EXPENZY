# Expense Tracker Backend - Complete Roadmap

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Edge Cases & Validations](#edge-cases--validations)
6. [Implementation Phases](#implementation-phases)
7. [Testing Strategy](#testing-strategy)
8. [Performance Optimization](#performance-optimization)

---

## 🎯 Project Overview

A comprehensive expense tracking system supporting:
- Individual user expenses
- Loan management (borrowed/lent)
- Expense splitting among users
- Monthly & yearly summaries
- Multi-currency support
- Recurring expenses
- Budget tracking

---

## 🛠 Tech Stack

- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL 14+
- **ORM**: TypeORM or Prisma
- **Authentication**: JWT + Refresh Tokens
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Caching**: Redis (for summaries)
- **File Storage**: AWS S3 (for receipts)

---

## 🗄 Database Schema

### **1. users**
Stores user account information.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    default_currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    profile_picture_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Edge Cases:**
- Soft delete support (deleted_at)
- Email verification flow
- Multi-device login tracking

---

### **2. categories**
Predefined and user-defined expense categories.

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income')),
    is_system BOOLEAN DEFAULT false,
    parent_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name, type)
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_parent ON categories(parent_category_id);
CREATE INDEX idx_categories_is_system ON categories(is_system);
```

**Edge Cases:**
- System categories (cannot be deleted)
- Hierarchical categories (parent-child)
- User-specific vs global categories
- Prevent circular references in parent-child

---

### **3. expenses**
Main expense records.

```sql
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    original_amount DECIMAL(15, 2),
    original_currency VARCHAR(3),
    exchange_rate DECIMAL(10, 4),
    description TEXT,
    expense_date DATE NOT NULL,
    payment_method VARCHAR(50),
    is_recurring BOOLEAN DEFAULT false,
    recurring_pattern_id UUID REFERENCES recurring_patterns(id),
    receipt_url TEXT,
    notes TEXT,
    tags TEXT[],
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_expenses_created_at ON expenses(created_at);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, expense_date);
CREATE INDEX idx_expenses_deleted_at ON expenses(deleted_at);
CREATE INDEX idx_expenses_tags ON expenses USING GIN(tags);
```

**Edge Cases:**
- Multi-currency with exchange rates
- Soft delete for audit trail
- Array tags for flexible categorization
- Optional geolocation

---

### **4. recurring_patterns**
Defines recurring expense patterns.

```sql
CREATE TABLE recurring_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
    interval INT DEFAULT 1 CHECK (interval > 0),
    day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
    day_of_month INT CHECK (day_of_month BETWEEN 1 AND 31),
    start_date DATE NOT NULL,
    end_date DATE,
    next_occurrence DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recurring_user_id ON recurring_patterns(user_id);
CREATE INDEX idx_recurring_next_occurrence ON recurring_patterns(next_occurrence);
CREATE INDEX idx_recurring_is_active ON recurring_patterns(is_active);
```

**Edge Cases:**
- Handle leap years
- Month-end dates (e.g., 31st in February)
- Timezone considerations
- Auto-disable on end_date

---

### **5. split_expenses**
Expenses shared among multiple users.

```sql
CREATE TABLE split_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    total_amount DECIMAL(15, 2) NOT NULL CHECK (total_amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    split_type VARCHAR(20) NOT NULL CHECK (split_type IN ('equal', 'percentage', 'exact', 'shares')),
    paid_by_user_id UUID NOT NULL REFERENCES users(id),
    description TEXT,
    is_settled BOOLEAN DEFAULT false,
    settled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_split_expenses_expense_id ON split_expenses(expense_id);
CREATE INDEX idx_split_expenses_paid_by ON split_expenses(paid_by_user_id);
CREATE INDEX idx_split_expenses_is_settled ON split_expenses(is_settled);
```

**Edge Cases:**
- Prevent split amount > total amount
- Handle rounding errors in splits
- Partial settlements

---

### **6. split_participants**
Individual participants in split expenses.

```sql
CREATE TABLE split_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    split_expense_id UUID NOT NULL REFERENCES split_expenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_owed DECIMAL(15, 2) NOT NULL CHECK (amount_owed >= 0),
    amount_paid DECIMAL(15, 2) DEFAULT 0 CHECK (amount_paid >= 0),
    percentage DECIMAL(5, 2) CHECK (percentage BETWEEN 0 AND 100),
    shares INT CHECK (shares > 0),
    is_settled BOOLEAN DEFAULT false,
    settled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(split_expense_id, user_id)
);

CREATE INDEX idx_split_participants_split_id ON split_participants(split_expense_id);
CREATE INDEX idx_split_participants_user_id ON split_participants(user_id);
CREATE INDEX idx_split_participants_is_settled ON split_participants(is_settled);
```

**Edge Cases:**
- Ensure sum of amounts = total
- Handle partial payments
- Prevent negative payments

---

### **7. loans**
Track money lent or borrowed.

```sql
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lender_user_id UUID NOT NULL REFERENCES users(id),
    borrower_user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    interest_rate DECIMAL(5, 2) DEFAULT 0 CHECK (interest_rate >= 0),
    description TEXT,
    loan_date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paid', 'partial', 'overdue', 'cancelled')),
    amount_paid DECIMAL(15, 2) DEFAULT 0 CHECK (amount_paid >= 0),
    amount_remaining DECIMAL(15, 2) NOT NULL CHECK (amount_remaining >= 0),
    payment_terms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (lender_user_id != borrower_user_id)
);

CREATE INDEX idx_loans_lender_id ON loans(lender_user_id);
CREATE INDEX idx_loans_borrower_id ON loans(borrower_user_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_due_date ON loans(due_date);
CREATE INDEX idx_loans_loan_date ON loans(loan_date);
```

**Edge Cases:**
- Prevent self-loans
- Compound interest calculations
- Overdue loan detection
- Partial repayments

---

### **8. loan_payments**
Track loan repayments.

```sql
CREATE TABLE loan_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loan_payments_loan_id ON loan_payments(loan_id);
CREATE INDEX idx_loan_payments_payment_date ON loan_payments(payment_date);
```

**Edge Cases:**
- Prevent overpayment
- Auto-update loan status
- Multiple payment methods

---

### **9. budgets**
Monthly/yearly budget limits.

```sql
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    spent_amount DECIMAL(15, 2) DEFAULT 0,
    alert_threshold DECIMAL(5, 2) CHECK (alert_threshold BETWEEN 0 AND 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date > start_date)
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
CREATE INDEX idx_budgets_period ON budgets(start_date, end_date);
CREATE INDEX idx_budgets_is_active ON budgets(is_active);
```

**Edge Cases:**
- Budget rollover
- Alert notifications at threshold
- Category vs overall budget
- Multi-currency conversion

---

### **10. monthly_summaries**
Pre-calculated monthly aggregates (for performance).

```sql
CREATE TABLE monthly_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    year INT NOT NULL,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    total_income DECIMAL(15, 2) DEFAULT 0,
    total_expenses DECIMAL(15, 2) DEFAULT 0,
    net_savings DECIMAL(15, 2) DEFAULT 0,
    category_breakdown JSONB,
    expense_count INT DEFAULT 0,
    average_expense DECIMAL(15, 2) DEFAULT 0,
    largest_expense DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, year, month, currency)
);

CREATE INDEX idx_monthly_summaries_user_id ON monthly_summaries(user_id);
CREATE INDEX idx_monthly_summaries_year_month ON monthly_summaries(year, month);
CREATE INDEX idx_monthly_summaries_user_year_month ON monthly_summaries(user_id, year, month);
```

**Edge Cases:**
- Recalculate on expense changes
- Handle timezone differences
- Multi-currency aggregation

---

### **11. yearly_summaries**
Pre-calculated yearly aggregates.

```sql
CREATE TABLE yearly_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    year INT NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    total_income DECIMAL(15, 2) DEFAULT 0,
    total_expenses DECIMAL(15, 2) DEFAULT 0,
    net_savings DECIMAL(15, 2) DEFAULT 0,
    category_breakdown JSONB,
    expense_count INT DEFAULT 0,
    average_monthly_expense DECIMAL(15, 2) DEFAULT 0,
    largest_expense DECIMAL(15, 2) DEFAULT 0,
    month_with_highest_expense INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, year, currency)
);

CREATE INDEX idx_yearly_summaries_user_id ON yearly_summaries(user_id);
CREATE INDEX idx_yearly_summaries_year ON yearly_summaries(year);
CREATE INDEX idx_yearly_summaries_user_year ON yearly_summaries(user_id, year);
```

---

### **12. notifications**
User notification system.

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

---

### **13. audit_logs**
Track all important changes.

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

### **14. exchange_rates**
Store currency exchange rates.

```sql
CREATE TABLE exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_currency VARCHAR(3) NOT NULL,
    target_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(15, 6) NOT NULL CHECK (rate > 0),
    rate_date DATE NOT NULL,
    source VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(base_currency, target_currency, rate_date)
);

CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(base_currency, target_currency);
CREATE INDEX idx_exchange_rates_date ON exchange_rates(rate_date);
```

---

### **15. attachments**
Store receipt and document attachments.

```sql
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_entity ON attachments(entity_type, entity_id);
CREATE INDEX idx_attachments_user_id ON attachments(user_id);
```

---

## 🔐 Additional Constraints & Triggers

### Trigger: Auto-update monthly/yearly summaries

```sql
CREATE OR REPLACE FUNCTION update_summaries()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate monthly summary when expense changes
    -- (Implement aggregation logic)
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_monthly_summary
AFTER INSERT OR UPDATE OR DELETE ON expenses
FOR EACH ROW EXECUTE FUNCTION update_summaries();
```

### Trigger: Update loan status

```sql
CREATE OR REPLACE FUNCTION update_loan_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE loans 
    SET 
        amount_remaining = amount - amount_paid,
        status = CASE 
            WHEN amount_paid >= amount THEN 'paid'
            WHEN amount_paid > 0 THEN 'partial'
            ELSE status
        END
    WHERE id = NEW.loan_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_loan_status
AFTER INSERT ON loan_payments
FOR EACH ROW EXECUTE FUNCTION update_loan_status();
```

---

## 🚀 API Endpoints

### **Authentication**
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/reset-password
POST   /auth/verify-email
```

### **Users**
```
GET    /users/me
PATCH  /users/me
DELETE /users/me
GET    /users/:id/profile
```

### **Categories**
```
GET    /categories
POST   /categories
PATCH  /categories/:id
DELETE /categories/:id
GET    /categories/system
```

### **Expenses**
```
GET    /expenses
POST   /expenses
GET    /expenses/:id
PATCH  /expenses/:id
DELETE /expenses/:id
GET    /expenses/search
GET    /expenses/by-date-range
POST   /expenses/:id/upload-receipt
```

### **Recurring Expenses**
```
GET    /recurring-expenses
POST   /recurring-expenses
PATCH  /recurring-expenses/:id
DELETE /recurring-expenses/:id
POST   /recurring-expenses/:id/generate
```

### **Split Expenses**
```
GET    /split-expenses
POST   /split-expenses
GET    /split-expenses/:id
PATCH  /split-expenses/:id
DELETE /split-expenses/:id
POST   /split-expenses/:id/settle
POST   /split-expenses/:id/participants/:userId/settle
```

### **Loans**
```
GET    /loans
POST   /loans
GET    /loans/:id
PATCH  /loans/:id
DELETE /loans/:id
GET    /loans/lent
GET    /loans/borrowed
POST   /loans/:id/payments
GET    /loans/:id/payments
```

### **Budgets**
```
GET    /budgets
POST   /budgets
PATCH  /budgets/:id
DELETE /budgets/:id
GET    /budgets/current
GET    /budgets/:id/progress
```

### **Summaries**
```
GET    /summaries/monthly?year=2024&month=11
GET    /summaries/yearly?year=2024
GET    /summaries/dashboard
GET    /summaries/trends
```

### **Reports**
```
GET    /reports/export?format=csv|pdf
GET    /reports/category-analysis
GET    /reports/spending-habits
```

---

## ⚠️ Edge Cases & Validations

### **1. Data Integrity**
- ✅ Prevent negative amounts
- ✅ Validate date ranges (start < end)
- ✅ Ensure split amounts sum to total
- ✅ Prevent self-referencing (loans to self)
- ✅ Validate currency codes (ISO 4217)
- ✅ Check category existence before deletion

### **2. Business Logic**
- ✅ Loan overpayment prevention
- ✅ Budget threshold alerts
- ✅ Recurring expense generation (handle leap years)
- ✅ Split rounding error handling (cents distribution)
- ✅ Timezone conversion for date calculations
- ✅ Soft delete implementation for audit trails

### **3. Concurrency**
- ✅ Optimistic locking (version field)
- ✅ Transaction isolation for split settlements
- ✅ Prevent duplicate recurring expense generation
- ✅ Handle simultaneous loan payments

### **4. Security**
- ✅ Rate limiting (100 requests/15min per user)
- ✅ SQL injection prevention (parameterized queries)
- ✅ JWT expiration and refresh
- ✅ File upload validation (type, size)
- ✅ CORS configuration
- ✅ Row-level security (users can only see their data)

### **5. Performance**
- ✅ Pagination (limit, offset)
- ✅ Cached summaries (Redis)
- ✅ Database indexes on frequently queried columns
- ✅ Lazy loading for relationships
- ✅ Batch operations for recurring expenses

### **6. User Experience**
- ✅ Handle deleted category (set to NULL)
- ✅ Default currency from user preferences
- ✅ Timezone-aware date handling
- ✅ Partial payment support
- ✅ Multi-currency display

---

## 📅 Implementation Phases

### **Phase 1: Foundation (Week 1-2)**
- [ ] Project setup (NestJS, TypeORM, PostgreSQL)
- [ ] Database schema implementation
- [ ] Authentication system (JWT)
- [ ] User management module
- [ ] Category management module
- [ ] Basic CRUD for expenses

### **Phase 2: Core Features (Week 3-4)**
- [ ] Expense management with attachments
- [ ] Multi-currency support
- [ ] Recurring expenses
- [ ] Budget tracking
- [ ] Notification system

### **Phase 3: Social Features (Week 5-6)**
- [ ] Split expense module
- [ ] Loan tracking
- [ ] Settlement workflows
- [ ] User connections

### **Phase 4: Analytics (Week 7-8)**
- [ ] Monthly/yearly summaries
- [ ] Dashboard aggregations
- [ ] Trend analysis
- [ ] Report generation (CSV, PDF)

### **Phase 5: Optimization (Week 9-10)**
- [ ] Redis caching
- [ ] Query optimization
- [ ] Background jobs (recurring generation)
- [ ] File storage (S3)

### **Phase 6: Testing & Documentation (Week 11-12)**
- [ ] Unit tests (70%+ coverage)
- [ ] Integration tests
- [ ] E2E tests
- [ ] Swagger documentation
- [ ] Deployment setup (Docker)

---

## 🧪 Testing Strategy

### **Unit Tests**
- Service methods
- Validation logic
- Calculation functions (splits, loans)
- Edge case handling

### **Integration Tests**
- API endpoint responses
- Database transactions
- Authentication flows
- File uploads

### **E2E Tests**
- Complete user workflows
- Split expense creation and settlement
- Loan lifecycle
- Budget alerts

### **Performance Tests**
- Load testing (1000+ concurrent users)
- Database query performance
- API response times (<200ms)

---

## ⚡ Performance Optimization

### **Database**
1. **Indexes**: Applied on all foreign keys and frequently queried columns
2. **Partitioning**: Partition expenses by year for large datasets
3. **Materialized Views**: For complex aggregations
4. **Connection Pooling**: Configure PgBouncer

### **Caching**
1. **Redis**: Cache user summaries (TTL: 1 hour)
2. **Query Result Cache**: Category lists, exchange rates
3. **CDN**: Static files and receipts

### **Code**
1. **Eager/Lazy Loading**: Optimize TypeORM relations
2. **Batch Processing**: Recurring expense generation
3. **Pagination**: All list endpoints
4. **DTOs**: Minimize data transfer

### **Monitoring**
1. **Logging**: Winston + ELK stack
2. **Metrics**: Prometheus + Grafana
3. **Error Tracking**: Sentry
4. **APM**: New Relic or DataDog

---

## 🔧 Environment Variables

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=expense_tracker
DATABASE_USER=postgres
DATABASE_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=expense-receipts

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password

# Exchange Rates API
EXCHANGE_RATE_API_KEY=your-key
```

---

## 📦 Recommended Packages

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/swagger": "^7.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0",
    "bcrypt": "^5.1.1",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "redis": "^4.6.0",
    "aws-sdk": "^2.1400.0",
    "nodemailer": "^6.9.0",
    "pdf-lib": "^1.17.1",
    "csv-parser": "^3.0.0"
  },
  "devDependencies": {
    "@nestjs/testing": "^10.0.0",
    "jest": "^29.0.0",
    "supertest": "^6.3.0"
  }
}
```

---

## 🎯 Success Metrics

- **Performance**: API response < 200ms (95th percentile)
- **Reliability**: 99.9% uptime
- **Security**: Zero critical vulnerabilities
- **Test Coverage**: >80%
- **User Satisfaction**: <500ms page load time

---

## 📚 Next Steps

1. Set up development environment
2. Initialize NestJS project with TypeORM
3. Create database migrations
4. Implement authentication module first
5. Build modules incrementally following phases
6. Write tests alongside features
7. Deploy to staging environment
8. Performance testing and optimization
9. Production deployment

---

**Good luck building your expense tracker! 🚀**
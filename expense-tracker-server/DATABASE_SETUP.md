# Database Setup Instructions

## Current Issue
PostgreSQL is not running on port 5433. The server cannot connect to the database.

## Database Configuration
From `.env`:
```
DATABASE_URL="postgresql://root:root@localhost:5433/expense-tracker"
```

## Solutions

### Option 1: Start PostgreSQL Service (Recommended)
```bash
# Check if PostgreSQL is installed
which psql

# Start PostgreSQL
sudo systemctl start postgresql
# or
sudo service postgresql start

# Check status
sudo systemctl status postgresql
```

### Option 2: Use Docker (Easiest)
```bash
# Run PostgreSQL in Docker
docker run --name expenzy-postgres \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=root \
  -e POSTGRES_DB=expense-tracker \
  -p 5433:5432 \
  -d postgres:15

# Check if running
docker ps | grep expenzy-postgres
```

### Option 3: Change Port to 5432
Update `.env`:
```
DATABASE_URL="postgresql://root:root@localhost:5432/expense-tracker"
```

## After Database is Running

1. Apply migrations:
```bash
npx prisma migrate deploy
```

2. Generate Prisma Client:
```bash
npx prisma generate
```

3. Start server:
```bash
npm run start:dev
```

## Verify Connection
```bash
# Test database connection
npx prisma db pull
```

# Expense Tracker API - Docker Setup

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed

### Running the Application

1. **Copy environment file:**
```bash
cp .env.example .env
```

2. **Update the .env file with your configuration:**
```env
JWT_SECRET=your-super-secret-key-change-this
POSTGRES_USER=expense_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=expense_tracker
```

3. **Start all services:**
```bash
docker-compose up -d
```

4. **Check service status:**
```bash
docker-compose ps
```

5. **View logs:**
```bash
docker-compose logs -f app
```

6. **Run database migrations:**
```bash
docker-compose exec app npx prisma migrate deploy
```

7. **Seed the database (optional):**
```bash
docker-compose exec app npx ts-node prisma/seed.ts
```

### Accessing the Application

- **API**: http://localhost:5000/api
- **Swagger Docs**: http://localhost:5000/api/docs
- **Health Check**: http://localhost:5000/api/health

### Stopping the Application

```bash
docker-compose down
```

### Stopping and Removing Volumes

```bash
docker-compose down -v
```

## Development

For local development without Docker:

```bash
npm install
npm run start:dev
```

## Production Deployment

1. Build the Docker image:
```bash
docker build -t expense-tracker-api .
```

2. Run with production settings:
```bash
docker-compose -f docker-compose.yml up -d
```

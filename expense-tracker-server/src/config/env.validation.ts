import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Node Environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Server Configuration
  PORT: Joi.number().default(5000),

  // Database Configuration
  DATABASE_URL: Joi.string().required(),

  // JWT Configuration
  JWT_SECRET: Joi.string().required().min(32),
  JWT_EXPIRATION: Joi.string().default('7d'),

  // CORS Configuration
  CORS_ORIGIN: Joi.string().default(
    'http://localhost:3000,http://localhost:5173',
  ),

  // PostgreSQL Configuration (for Docker)
  POSTGRES_USER: Joi.string().default('expense_user'),
  POSTGRES_PASSWORD: Joi.string().default('expense_password'),
  POSTGRES_DB: Joi.string().default('expense_tracker'),
  POSTGRES_PORT: Joi.number().default(5434),

  // Redis Configuration (optional)
  REDIS_HOST: Joi.string().optional(),
  REDIS_PORT: Joi.number().optional().default(6379),
  REDIS_PASSWORD: Joi.string().optional().allow(''),

  // Email Configuration (optional)
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().optional(),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASS: Joi.string().optional(),

  // AWS S3 Configuration (optional)
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_S3_BUCKET: Joi.string().optional(),
  AWS_REGION: Joi.string().optional().default('us-east-1'),

  // Sentry Configuration (optional)
  SENTRY_DSN: Joi.string().optional(),

  // Rate Limiting
  THROTTLE_TTL: Joi.number().default(60000), // 60 seconds
  THROTTLE_LIMIT: Joi.number().default(100), // 100 requests
});

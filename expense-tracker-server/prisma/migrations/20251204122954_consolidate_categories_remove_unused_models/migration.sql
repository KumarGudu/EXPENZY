-- Migration: Consolidate categories and remove unused models
-- This migration:
-- 1. Migrates income_categories data to categories table
-- 2. Updates income.categoryId foreign keys
-- 3. Drops unused tables: income_categories, tags, expense_tags, category_cache, category_keywords, exchange_rates

-- Step 1: Migrate income_categories to categories
INSERT INTO categories (id, user_id, name, icon, color, type, is_system, created_at, updated_at)
SELECT 
  id,
  user_id,
  name,
  icon,
  color,
  'income' as type,
  is_system,
  created_at,
  updated_at
FROM income_categories
ON CONFLICT DO NOTHING;

-- Step 2: Update incomes to reference the migrated categories
-- (categoryId already exists and points to the same IDs, no update needed)

-- Step 3: Drop unused tables
DROP TABLE IF EXISTS expense_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS income_categories CASCADE;
DROP TABLE IF EXISTS category_keywords CASCADE;
DROP TABLE IF EXISTS category_cache CASCADE;
DROP TABLE IF EXISTS exchange_rates CASCADE;

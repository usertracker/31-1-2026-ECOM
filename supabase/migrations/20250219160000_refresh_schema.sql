/*
  # Refresh Schema Cache
  
  ## Query Description: 
  This migration forces a reload of the PostgREST schema cache. This is required because the previous column addition ('is_best_seller') might not be recognized by the API layer yet, causing PGRST204 errors. It also safely ensures the column exists.

  ## Metadata:
  - Schema-Category: "Safe"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true
  
  ## Structure Details:
  - Table: products
  - Column: is_best_seller (Idempotent check)
  - System: PostgREST cache reload
*/

-- 1. Ensure the column exists (idempotent check)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT false;

-- 2. Force PostgREST schema cache reload
-- This is the critical step to fix PGRST204
NOTIFY pgrst, 'reload schema';

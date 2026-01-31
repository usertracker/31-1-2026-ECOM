-- 1. Add 'addresses' column as JSONB array, default empty
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS addresses JSONB DEFAULT '[]'::jsonb;

-- 2. Migrate existing single 'address' data to the new 'addresses' array
-- We wrap the existing address object in a JSON array if it exists
UPDATE public.users 
SET addresses = jsonb_build_array(address) 
WHERE address IS NOT NULL AND address::text != 'null';

-- 3. (Optional) We keep the old 'address' column for safety for now, 
-- but the code will switch to using 'addresses'.

-- 4. Force Schema Cache Reload
NOTIFY pgrst, 'reload config';

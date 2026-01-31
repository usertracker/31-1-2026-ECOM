/*
  # Add Language Column
  Adds a language preference column to the users table.

  ## Changes
  - Add `language` column to `users` table with default 'en'
*/

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';

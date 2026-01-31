/*
  # Add Address Columns to Orders

  ## Query Description:
  Adds JSONB columns to the orders table to store shipping address and customer details snapshot at the time of order.
  This ensures that even if a user changes their profile address later, the order record remains accurate.

  ## Metadata:
  - Schema-Category: Structural
  - Impact-Level: Low
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - `shipping_address` (JSONB): Stores street, city, state, zip
  - `customer_details` (JSONB): Stores name, phone at time of order
*/

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_address JSONB,
ADD COLUMN IF NOT EXISTS customer_details JSONB;

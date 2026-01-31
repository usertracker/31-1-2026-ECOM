-- Create a storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 1. Allow Public Read Access (So everyone can see product images)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- 2. Allow Uploads (For demo purposes, allowing anon uploads since Seller Auth is custom table-based)
-- In a production app with full Supabase Auth, you would restrict this to 'authenticated' users.
create policy "Allow Uploads"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' );

-- 3. Allow Updates (for replacing images)
create policy "Allow Updates"
  on storage.objects for update
  with check ( bucket_id = 'product-images' );

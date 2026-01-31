import { supabase } from '../lib/supabase';

export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    // 1. Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log(`Attempting to upload ${fileName} to product-images bucket...`);

    // 2. Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading to product-images bucket:', uploadError);
      throw uploadError;
    }

    // 3. Get the Public URL
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    if (data.publicUrl) {
        console.log('Upload successful:', data.publicUrl);
    }

    return data.publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};

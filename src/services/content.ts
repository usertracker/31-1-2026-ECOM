import { supabase } from '../lib/supabase';

export interface SiteAsset {
  key: string;
  value: string;
  label: string;
  section: string;
  type: string;
}

// Helper to check for AbortError
const isAbortError = (error: any) => {
  return error?.message?.includes('AbortError') || 
         error?.details?.includes('AbortError') ||
         error?.code === '20';
};

export const contentService = {
  async getAllAssets(): Promise<SiteAsset[]> {
    try {
      const { data, error } = await supabase
        .from('site_assets')
        .select('*')
        .order('section', { ascending: true });
      
      if (error) {
        if (isAbortError(error)) {
            console.warn("Assets fetch aborted (harmless)");
            return [];
        }
        console.error('Error fetching assets:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      return [];
    }
  },

  async updateAsset(key: string, value: string): Promise<void> {
    const { error } = await supabase
      .from('site_assets')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);

    if (error) throw error;
  },

  async getAsset(key: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('site_assets')
        .select('value')
        .eq('key', key)
        .single();
        
      if (error && !isAbortError(error)) console.error("Error getting asset:", key, error);
      return data?.value || null;
    } catch (err) {
      return null;
    }
  }
};

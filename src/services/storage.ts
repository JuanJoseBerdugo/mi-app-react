import { supabase } from '../lib/supabase';

export const deleteFile = async (filePath: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('assets-bucket')
    .remove([filePath]);

  if (error) throw error;
};

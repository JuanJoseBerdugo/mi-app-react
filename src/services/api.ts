import { supabase } from '../lib/supabase';
import type { Asset } from '../types';

export const fetchAssets = async (term: string = ''): Promise<{ data: Asset[] | null; error: Error | null }> => {
  let query = supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });

  if (term) {
    query = query.ilike('name', `%${term}%`); // busca "term" en cualquier posición
  }

  const { data, error } = await query;
  return { data: data as Asset[] | null, error: error as Error | null };
};

export const createAsset = async (
  data: Pick<Asset, 'name' | 'amount'>
): Promise<{ error: Error | null }> => {
  const { error } = await supabase.from('assets').insert(data);
  return { error: error as Error | null };
};

export const updateAsset = async (
  id: string,
  data: Partial<Asset>
): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from('assets')
    .update(data)
    .eq('id', id); // <- VITAL: filtra por ID

  return { error: error as Error | null };
};

export const deleteAsset = async (id: string): Promise<{ error: Error | null }> => {
  const { error } = await supabase.from('assets').delete().eq('id', id);
  return { error: error as Error | null };
};

import { useState, useEffect, useCallback } from 'react';
import type { Asset } from '../types';
import { fetchAssets, createAsset, updateAsset } from '../services/api';
import { deleteFile } from '../services/storage';
import { supabase } from '../lib/supabase';

// ── Toast types ──────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Asset | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Loading individual por ítem — cada fila sabe si SU operación está en curso
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const setItemLoading = (id: string, on: boolean) => {
    setLoadingIds(prev => {
      const next = new Set(prev);
      on ? next.add(id) : next.delete(id);
      return next;
    });
  };

  // Sistema de toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const dismissToast = (id: string) =>
    setToasts(prev => prev.filter(t => t.id !== id));

  // ── Data fetching ────────────────────────────────────────────────────────
  const loadAssets = useCallback(async (term = '') => {
    setLoading(true);
    const { data, error } = await fetchAssets(term);
    if (error) {
      setError(error.message);
    } else {
      setAssets(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadAssets(); }, [loadAssets]);

  // Re-ejecuta la búsqueda cuando cambia el término
  useEffect(() => { loadAssets(searchTerm); }, [searchTerm, loadAssets]);

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const handleCreate = async (data: Pick<Asset, 'name' | 'amount'>) => {
    const { error } = await createAsset(data);
    if (error) {
      showToast(`Error al crear: ${error.message}`, 'error');
    } else {
      await loadAssets(searchTerm);
      showToast('Asset creado ✅', 'success');
    }
    return { error };
  };

  const handleUpdate = async (id: string, data: Partial<Asset>) => {
    setItemLoading(id, true);
    const { error } = await updateAsset(id, data);
    setItemLoading(id, false);
    if (error) {
      showToast(`Error al guardar: ${error.message}`, 'error');
    } else {
      await loadAssets(searchTerm);
      cancelEdit();
      showToast('Cambios guardados ✅', 'success');
    }
    return { error };
  };

  // Actualización optimista: la UI reacciona ANTES de esperar al servidor
  const deleteOptimistic = async (id: string) => {
    const previous = [...assets];                         // 1. snapshot para rollback
    setAssets(prev => prev.filter(a => a.id !== id));     // 2. update inmediato

    const targetItem = previous.find(a => a.id === id);

    try {
      if (targetItem?.file_path) {
        await deleteFile(targetItem.file_path);           // Storage primero
      }

      const { error } = await supabase                   // 3. llamada al servidor
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Asset eliminado 🗑️', 'success');
    } catch (err) {
      setAssets(previous);                               // 4. rollback si falla
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      showToast(`Error: ${msg} — cambio revertido`, 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    const id = deletingId;
    setDeletingId(null); // cierra el modal inmediatamente
    await deleteOptimistic(id);
    setIsDeleting(false);
  };

  const handleEdit = (item: Asset) => {
    setEditingId(item.id);
    setEditingItem(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingItem(null);
  };

  return {
    assets,
    loading,
    error,
    editingId,
    editingItem,
    deletingId,
    isDeleting,
    loadingIds,
    toasts,
    setDeletingId,
    showToast,
    dismissToast,
    handleCreate,
    handleUpdate,
    confirmDelete,
    deleteOptimistic,
    handleEdit,
    cancelEdit,
    searchTerm,
    setSearchTerm,
  };
}

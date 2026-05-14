import type { CSSProperties } from 'react';
import { useAssets } from '../../hooks/useAssets';
import AssetForm from '../AssetForm';
import AssetTable from '../AssetTable';
import DeleteModal from '../DeleteModal';
import SearchBar from '../SearchBar';
import ToastContainer from '../ToastContainer';

export default function AssetManager() {
  const {
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
    dismissToast,
    handleCreate,
    handleUpdate,
    confirmDelete,
    handleEdit,
    cancelEdit,
    searchTerm,
    setSearchTerm,
  } = useAssets();

  const handleFormSubmit = async (data: { name: string; amount: number }) => {
    if (editingItem) {
      return handleUpdate(editingItem.id, data);
    }
    return handleCreate(data);
  };

  return (
    <section style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.badge}>Supabase — CRUD</span>
        <h2 style={styles.title}>Asset Manager</h2>
        <p style={styles.copy}>
          Módulo <strong>Optimistic UI</strong>: borrar es inmediato en la UI,
          con rollback automático si el servidor falla. Toasts de feedback en cada acción.
        </p>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <AssetForm
        editingItem={editingItem}
        onSubmit={handleFormSubmit}
        onCancel={cancelEdit}
      />

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <AssetTable
        assets={assets}
        loading={loading}
        editingId={editingId}
        loadingIds={loadingIds}
        onEdit={handleEdit}
        onDeleteRequest={setDeletingId}
      />

      <DeleteModal
        isOpen={deletingId !== null}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    color: '#e2e8f0',
    maxWidth: 960,
    margin: '0 auto',
    padding: '28px 18px',
  },
  header: {
    marginBottom: 22,
  },
  badge: {
    display: 'inline-flex',
    borderRadius: 999,
    padding: '6px 12px',
    background: 'rgba(56, 189, 248, 0.12)',
    border: '1px solid rgba(56, 189, 248, 0.28)',
    color: '#38bdf8',
    fontSize: '0.76rem',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  title: {
    margin: '14px 0 8px',
    fontSize: '2rem',
    color: '#f8fafc',
  },
  copy: {
    maxWidth: 680,
    color: '#a8b3c7',
    lineHeight: 1.6,
  },
  errorBox: {
    marginBottom: 16,
    padding: '12px 16px',
    borderRadius: 10,
    border: '1px solid rgba(248, 113, 113, 0.32)',
    background: 'rgba(127, 29, 29, 0.22)',
    color: '#fecaca',
  },
};

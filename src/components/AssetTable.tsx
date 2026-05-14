import type { CSSProperties } from 'react';
import type { Asset } from '../types';

interface AssetTableProps {
  assets: Asset[];
  loading: boolean;
  editingId: string | null;
  loadingIds: Set<string>;
  onEdit: (item: Asset) => void;
  onDeleteRequest: (id: string) => void;
}

export default function AssetTable({
  assets,
  loading,
  editingId,
  loadingIds,
  onEdit,
  onDeleteRequest,
}: AssetTableProps) {
  if (loading) {
    return <div style={styles.empty}>Cargando assets...</div>;
  }

  if (assets.length === 0) {
    return <div style={styles.empty}>No hay assets. ¡Agrega el primero!</div>;
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>NOMBRE</th>
            <th style={styles.th}>MONTO</th>
            <th style={styles.th}>CREADO</th>
            <th style={styles.th}>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((item) => (
            <tr
              key={item.id}
              style={{
                ...styles.tr,
                ...(editingId === item.id ? styles.trEditing : {}),
              }}
            >
              <td style={styles.td}>{item.name}</td>
              <td style={styles.td}>{item.amount}</td>
              <td style={styles.td}>
                {new Date(item.created_at).toLocaleDateString('es-MX')}
              </td>
              <td style={styles.td}>
                <div style={styles.btnGroup}>
                  <button
                    onClick={() => onEdit(item)}
                    disabled={loadingIds.has(item.id)}
                    style={{
                      ...styles.btnEdit,
                      ...(loadingIds.has(item.id) ? styles.btnDisabled : {}),
                    }}
                  >
                    {loadingIds.has(item.id) ? '⏳ Guardando...' : '✏️ Editar'}
                  </button>
                  <button
                    onClick={() => onDeleteRequest(item.id)}
                    disabled={loadingIds.has(item.id)}
                    style={{
                      ...styles.btnDelete,
                      ...(loadingIds.has(item.id) ? styles.btnDisabled : {}),
                    }}
                  >
                    🗑️ Borrar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    overflowX: 'auto',
    borderRadius: 12,
    border: '1px solid #243244',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#111827',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    color: '#64748b',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    borderBottom: '1px solid #1e293b',
    background: '#0f172a',
  },
  tr: {
    borderBottom: '1px solid #1e293b',
    transition: 'background 0.15s',
  },
  trEditing: {
    background: 'rgba(251, 191, 36, 0.06)',
    outline: '1px solid rgba(251, 191, 36, 0.3)',
  },
  td: {
    padding: '12px 16px',
    color: '#e2e8f0',
    fontSize: '0.9rem',
  },
  btnGroup: {
    display: 'flex',
    gap: 8,
  },
  btnEdit: {
    padding: '6px 12px',
    borderRadius: 6,
    border: '1px solid rgba(236, 72, 153, 0.4)',
    background: 'rgba(236, 72, 153, 0.1)',
    color: '#f472b6',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 600,
  },
  btnDelete: {
    padding: '6px 12px',
    borderRadius: 6,
    border: '1px solid rgba(248, 113, 113, 0.35)',
    background: 'rgba(127, 29, 29, 0.15)',
    color: '#f87171',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 600,
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  empty: {
    padding: 32,
    textAlign: 'center',
    color: '#64748b',
    border: '1px dashed #334155',
    borderRadius: 12,
  },
};

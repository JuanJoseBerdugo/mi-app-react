import type { CSSProperties } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ isOpen, isDeleting, onConfirm, onCancel }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.icon}>⚠️</div>
        <h3 style={styles.title}>¿Borrar este registro?</h3>
        <p style={styles.text}>Esta acción no se puede deshacer.</p>
        <div style={styles.actions}>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{ ...styles.btnConfirm, ...(isDeleting ? styles.btnDisabled : {}) }}
          >
            {isDeleting ? 'Borrando...' : 'Sí, borrar'}
          </button>
          <button onClick={onCancel} disabled={isDeleting} style={styles.btnCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.65)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#111827',
    border: '1px solid #334155',
    borderRadius: 16,
    padding: '32px 28px',
    maxWidth: 380,
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  icon: {
    fontSize: '2.5rem',
    marginBottom: 12,
  },
  title: {
    margin: '0 0 8px',
    fontSize: '1.2rem',
    color: '#f8fafc',
    fontWeight: 700,
  },
  text: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    marginBottom: 24,
  },
  actions: {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
  },
  btnConfirm: {
    padding: '10px 24px',
    borderRadius: 8,
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  btnCancel: {
    padding: '10px 24px',
    borderRadius: 8,
    border: '1px solid #475569',
    background: 'transparent',
    color: '#94a3b8',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  btnDisabled: {
    background: '#7f1d1d',
    cursor: 'not-allowed',
  },
};

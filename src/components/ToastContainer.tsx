import type { CSSProperties } from 'react';
import type { Toast } from '../hooks/useAssets';

const typeStyles: Record<Toast['type'], CSSProperties> = {
  success: { background: '#14532d', border: '1px solid #16a34a', color: '#bbf7d0' },
  error:   { background: '#7f1d1d', border: '1px solid #dc2626', color: '#fecaca' },
  info:    { background: '#0c1a2e', border: '1px solid #3b82f6', color: '#bfdbfe' },
};

const icons: Record<Toast['type'], string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div style={styles.container}>
      {toasts.map(toast => (
        <div key={toast.id} style={{ ...styles.toast, ...typeStyles[toast.type] }}>
          <span>{icons[toast.type]}</span>
          <span style={styles.msg}>{toast.message}</span>
          <button style={styles.close} onClick={() => onDismiss(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    zIndex: 2000,
    maxWidth: 360,
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    borderRadius: 10,
    fontSize: '0.9rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    animation: 'slideIn 0.2s ease',
  },
  msg: {
    flex: 1,
    lineHeight: 1.4,
  },
  close: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'inherit',
    opacity: 0.7,
    fontSize: '0.85rem',
    padding: 0,
    flexShrink: 0,
  },
};

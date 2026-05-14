import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CSSProperties } from 'react';
import type { Asset } from '../types';

type FormValues = Pick<Asset, 'name' | 'amount'>;

interface AssetFormProps {
  editingItem: Asset | null;
  onSubmit: (data: FormValues) => Promise<{ error: Error | null }>;
  onCancel: () => void;
}

export default function AssetForm({ editingItem, onSubmit, onCancel }: AssetFormProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (editingItem) {
      reset({ name: editingItem.name, amount: editingItem.amount });
    } else {
      reset({ name: '', amount: 0 });
    }
  }, [editingItem, reset]);

  const isEditMode = editingItem !== null;

  const handleFormSubmit = async (data: FormValues) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={styles.form}>
      {isEditMode && (
        <div style={styles.editBanner}>
          ✏️ <strong>Modo Edición activo</strong> — editando: <em>{editingItem?.name}</em>
        </div>
      )}

      <div style={styles.grid}>
        <div style={styles.field}>
          <label style={styles.label}>Nombre</label>
          <input
            {...register('name', { required: 'El nombre es requerido' })}
            placeholder="Ej: Bitcoin Core"
            style={styles.input}
          />
          {errors.name && <span style={styles.error}>{errors.name.message}</span>}
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Monto</label>
          <input
            type="number"
            step="any"
            {...register('amount', {
              required: 'El monto es requerido',
              valueAsNumber: true,
            })}
            placeholder="Ej: 0.45"
            style={styles.input}
          />
          {errors.amount && <span style={styles.error}>{errors.amount.message}</span>}
        </div>
      </div>

      <div style={styles.actions}>
        <button type="submit" disabled={isSubmitting} style={styles.btnPrimary}>
          {isSubmitting ? 'Guardando...' : isEditMode ? '💾 Guardar cambios' : '➕ Agregar Asset'}
        </button>
        {isEditMode && (
          <button type="button" onClick={onCancel} style={styles.btnCancel}>
            ✖ Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

const styles: Record<string, CSSProperties> = {
  form: {
    background: '#111827',
    border: '1px solid #243244',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  editBanner: {
    marginBottom: 16,
    padding: '10px 14px',
    borderRadius: 8,
    background: 'rgba(251, 191, 36, 0.1)',
    border: '1px solid rgba(251, 191, 36, 0.35)',
    color: '#fbbf24',
    fontSize: '0.9rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    color: '#94a3b8',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 700,
  },
  input: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 8,
    padding: '10px 12px',
    color: '#f8fafc',
    fontSize: '0.95rem',
    outline: 'none',
  },
  error: {
    color: '#f87171',
    fontSize: '0.8rem',
  },
  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 18,
  },
  btnPrimary: {
    padding: '10px 22px',
    borderRadius: 8,
    border: 'none',
    background: '#38bdf8',
    color: '#07111f',
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  btnCancel: {
    padding: '10px 22px',
    borderRadius: 8,
    border: '1px solid #475569',
    background: 'transparent',
    color: '#94a3b8',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

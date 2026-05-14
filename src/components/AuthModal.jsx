import { useEffect, useState } from 'react';

function AuthModal({ isOpen, mode, onClose, onSubmit }) {
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();
    const displayName = form.displayName.trim();

    if (!email || !password) {
      setError('Completa correo y contraseña para continuar.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener minimo 6 caracteres.');
      return;
    }

    if (mode === 'register' && !displayName) {
      setError('Agrega un nombre para crear tu perfil.');
      return;
    }

    try {
      setSubmitting(true);
      const result = await onSubmit({
        email,
        password,
        displayName: displayName || email.split('@')[0],
      });

      if (result?.notice) {
        setNotice(result.notice);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No pudimos completar la autenticacion.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="auth-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="auth-modal__top">
          <div>
            <span className="auth-modal__eyebrow">
              {mode === 'register' ? 'Crear sesión base' : 'Iniciar sesión'}
            </span>
            <h2 id="auth-modal-title">
              {mode === 'register' ? 'Activa tu trader profile' : 'Entra a tu mesa privada'}
            </h2>
            <p>
              {mode === 'register'
                ? 'Crea tu perfil para guardar saldo, compras, ventas, historial y foto en Supabase.'
                : 'Tu sesion desbloquea el trading y recupera tu perfil guardado.'}
            </p>
          </div>

          <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Cerrar modal">
            ×
          </button>
        </div>

        <form className="auth-modal__form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label className="auth-modal__field">
              <span>Nombre visible</span>
              <input
                type="text"
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                placeholder="Ej. Juan Collector"
              />
            </label>
          )}

          <label className="auth-modal__field">
            <span>Correo</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
            />
          </label>

          <label className="auth-modal__field">
            <span>Contraseña</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimo 6 caracteres"
            />
          </label>

          {error && <div className="auth-modal__error">{error}</div>}
          {notice && <div className="auth-modal__notice">{notice}</div>}

          <button className="auth-modal__submit" type="submit" disabled={submitting}>
            {submitting ? 'Conectando...' : mode === 'register' ? 'Crear perfil y entrar' : 'Entrar al mercado'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;

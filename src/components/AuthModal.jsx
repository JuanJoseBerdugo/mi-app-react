import { useEffect, useState } from 'react';

function AuthModal({ isOpen, mode, onClose, onSubmit }) {
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

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

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();
    const displayName = form.displayName.trim();

    if (!email || !password) {
      setError('Completa correo y contraseña para continuar.');
      return;
    }

    if (mode === 'register' && !displayName) {
      setError('Agrega un nombre para crear tu perfil.');
      return;
    }

    onSubmit({
      email,
      password,
      displayName: displayName || email.split('@')[0],
    });
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
                ? 'Crea un perfil local para guardar saldo, compras, ventas e historial en este navegador.'
                : 'Tu sesión básica desbloquea el trading y recupera tu saldo guardado.'}
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

          <button className="auth-modal__submit" type="submit">
            {mode === 'register' ? 'Crear perfil y entrar' : 'Entrar al mercado'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;

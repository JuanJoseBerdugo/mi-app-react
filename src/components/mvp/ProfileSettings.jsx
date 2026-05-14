import { useEffect, useRef, useState } from 'react';
import { savePokemonProfile, uploadPokemonAvatar } from '../../services/ProfileService';

function ProfileSettings({ authUser, onProfileUpdated }) {
  const [displayName, setDisplayName] = useState(authUser.displayName || '');
  const [xpRank, setXpRank] = useState(String(authUser.xpRank || 1000));
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setDisplayName(authUser.displayName || '');
    setXpRank(String(authUser.xpRank || 1000));
    setSelectedFile(null);
    setPreviewUrl('');
    setMessage('');
    setError('');
  }, [authUser]);

  useEffect(() => {
    if (!selectedFile) {
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  function handleFileChange(event) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setMessage('');
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanName = displayName.trim();
    const cleanRank = Number(xpRank);

    if (!cleanName) {
      setError('El nombre del piloto es obligatorio.');
      return;
    }

    if (!Number.isFinite(cleanRank) || cleanRank < 0) {
      setError('El XP Rank debe ser un numero positivo.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');

      let avatarPayload = {};

      if (selectedFile) {
        avatarPayload = await uploadPokemonAvatar(authUser.id, selectedFile);
      }

      const updatedProfile = await savePokemonProfile(authUser, {
        displayName: cleanName,
        xpRank: Math.floor(cleanRank),
        ...avatarPayload,
      });

      onProfileUpdated(updatedProfile);
      setSelectedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setMessage('Perfil actualizado.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  }

  const avatarSrc = previewUrl || authUser.avatarUrl;

  return (
    <section className="poke-market-section poke-profile-panel" aria-labelledby="profile-settings-title">
      <form className="poke-profile-form" onSubmit={handleSubmit}>
        <div className="poke-profile-avatar-zone">
          <button
            type="button"
            className="poke-profile-avatar"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Cambiar foto de perfil"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt={displayName || 'Avatar'} />
            ) : (
              <span className="poke-profile-avatar-placeholder" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className="poke-profile-camera"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Seleccionar nueva foto"
          >
            <span aria-hidden="true" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="poke-profile-file"
            onChange={handleFileChange}
          />
          {selectedFile && <span className="poke-profile-pending">Foto lista para confirmar</span>}
        </div>

        <div className="poke-profile-fields">
          <h2 id="profile-settings-title">Configuracion del perfil</h2>
          <div className="poke-profile-field-grid">
            <label className="poke-profile-field">
              <span>Pilot name</span>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Nombre..."
              />
            </label>
            <label className="poke-profile-field">
              <span>XP Rank</span>
              <input
                type="number"
                min="0"
                step="1"
                value={xpRank}
                onChange={(event) => setXpRank(event.target.value)}
                placeholder="1000"
              />
            </label>
          </div>

          {error && <div className="poke-profile-alert poke-profile-alert--error">{error}</div>}
          {message && <div className="poke-profile-alert poke-profile-alert--success">{message}</div>}

          <button type="submit" className="poke-profile-submit" disabled={saving}>
            {saving ? 'Actualizando...' : 'Actualizar perfil'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProfileSettings;

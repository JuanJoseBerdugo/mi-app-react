import { useState, useRef, useEffect } from "react";

export default function TheMirror() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPreviewUrl(url);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "1.5rem", color: "#e2e8f0" }}>
      <label style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
        padding: "1rem 2rem", border: "2px dashed #4a5568", borderRadius: "0.75rem",
        background: "#1a1a2e", cursor: "pointer",
      }}>
        <span style={{ fontSize: "1.4rem" }}>📁</span>
        <span style={{ fontWeight: 600, color: "#63b3ed" }}>Elegir imagen</span>
        <input type="file" accept="image/*" onChange={handleFileSelected} style={{ display: "none" }} />
      </label>

      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Vista previa"
          style={{ maxWidth: "100%", maxHeight: 320, borderRadius: "0.5rem", objectFit: "contain" }}
        />
      ) : (
        <div style={{ color: "#4a5568", fontSize: "0.9rem" }}>La previsualización aparecerá aquí</div>
      )}
    </div>
  );
}

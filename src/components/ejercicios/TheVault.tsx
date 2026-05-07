import { useState } from "react";
import type { CSSProperties, ChangeEvent } from "react";
import { uploadToVault } from "../../services/StorageService";

type UploadStatus = "idle" | "uploading" | "success" | "error";

type UploadResult = {
  bucket: string;
  path: string;
  publicUrl: string;
};

function getStorageErrorHelp(message: string) {
  if (message.toLowerCase().includes("failed to fetch")) {
    return "No se pudo conectar con Supabase. Revisa que VITE_SUPABASE_URL apunte al Project URL correcto, que el proyecto exista/este activo y reinicia Vite despues de cambiar el .env.";
  }

  return "Revisa que exista el bucket avatars y que tenga una policy de INSERT para el usuario actual o anon.";
}

export default function TheVault() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorHelp, setErrorHelp] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setResult(null);
    setErrorMessage("");
    setErrorHelp("");
    setStatus("idle");
  }

  async function handleUpload() {
    if (!file || status === "uploading") return;

    try {
      setStatus("uploading");
      setResult(null);
      setErrorMessage("");
      setErrorHelp("");

      const uploadResult = await uploadToVault(file);

      setResult(uploadResult);
      setStatus("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo subir el archivo a Supabase Storage.";

      setStatus("error");
      setErrorMessage(message);
      setErrorHelp(getStorageErrorHelp(message));
    }
  }

  const isImage = file?.type.startsWith("image/");

  return (
    <section style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.badge}>Supabase Storage</span>
        <h2 style={styles.title}>The Vault</h2>
        <p style={styles.copy}>
          Selecciona un archivo, subelo al bucket <strong>avatars</strong> y usa la URL publica que devuelve
          Supabase para mostrarlo desde el CDN.
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <label style={styles.dropzone}>
            <span style={styles.dropzoneIcon}>↑</span>
            <span style={styles.dropzoneTitle}>{file ? file.name : "Elegir archivo"}</span>
            <span style={styles.dropzoneHelp}>
              {file ? `${(file.size / 1024).toFixed(1)} KB` : "Imagen, PDF o cualquier archivo de prueba"}
            </span>
            <input type="file" onChange={handleFileChange} style={styles.hiddenInput} />
          </label>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || status === "uploading"}
            style={{
              ...styles.button,
              ...(!file || status === "uploading" ? styles.buttonDisabled : {}),
            }}
          >
            {status === "uploading" ? "Subiendo..." : "Ejecutar upload asincrono"}
          </button>

          {status === "error" && (
            <div style={styles.errorBox}>
              <strong>Error de Storage</strong>
              <p style={styles.messageText}>{errorMessage}</p>
              <p style={styles.messageHint}>{errorHelp}</p>
            </div>
          )}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Resultado del CDN</h3>

          {result ? (
            <div style={styles.resultBox}>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Bucket</span>
                <code style={styles.codeValue}>{result.bucket}</code>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Path</span>
                <code style={styles.codeValue}>{result.path}</code>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>publicUrl</span>
                <a href={result.publicUrl} target="_blank" rel="noreferrer" style={styles.url}>
                  {result.publicUrl}
                </a>
              </div>

              {isImage && <img src={result.publicUrl} alt={file?.name ?? "Archivo subido"} style={styles.preview} />}
            </div>
          ) : (
            <div style={styles.emptyState}>
              {status === "uploading" ? "Enviando archivo al bucket..." : "La URL publica aparecera aqui despues del upload."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    color: "#e2e8f0",
    maxWidth: 920,
    margin: "0 auto",
    padding: "28px 18px",
  },
  header: {
    marginBottom: 22,
  },
  badge: {
    display: "inline-flex",
    borderRadius: 999,
    padding: "6px 12px",
    background: "rgba(56, 189, 248, 0.12)",
    border: "1px solid rgba(56, 189, 248, 0.28)",
    color: "#38bdf8",
    fontSize: "0.76rem",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  title: {
    margin: "14px 0 8px",
    fontSize: "2rem",
    color: "#f8fafc",
  },
  copy: {
    maxWidth: 680,
    color: "#a8b3c7",
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 18,
  },
  card: {
    background: "#111827",
    border: "1px solid #243244",
    borderRadius: 12,
    padding: 18,
  },
  dropzone: {
    minHeight: 160,
    border: "2px dashed #334155",
    borderRadius: 10,
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    textAlign: "center",
    cursor: "pointer",
    padding: 20,
  },
  dropzoneIcon: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#38bdf8",
    color: "#07111f",
    fontSize: "1.4rem",
    fontWeight: 900,
  },
  dropzoneTitle: {
    color: "#f8fafc",
    fontWeight: 700,
    wordBreak: "break-word",
  },
  dropzoneHelp: {
    color: "#94a3b8",
    fontSize: "0.86rem",
  },
  hiddenInput: {
    display: "none",
  },
  button: {
    width: "100%",
    marginTop: 14,
    minHeight: 46,
    border: "none",
    borderRadius: 8,
    background: "#38bdf8",
    color: "#07111f",
    cursor: "pointer",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  buttonDisabled: {
    background: "#334155",
    color: "#94a3b8",
    cursor: "not-allowed",
  },
  errorBox: {
    marginTop: 14,
    borderRadius: 10,
    border: "1px solid rgba(248, 113, 113, 0.32)",
    background: "rgba(127, 29, 29, 0.22)",
    color: "#fecaca",
    padding: 12,
    lineHeight: 1.5,
  },
  messageText: {
    margin: "6px 0 0",
  },
  messageHint: {
    margin: "8px 0 0",
    color: "#fca5a5",
    fontSize: "0.86rem",
  },
  cardTitle: {
    margin: "0 0 14px",
    color: "#f8fafc",
    fontSize: "1rem",
  },
  resultBox: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  resultRow: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  resultLabel: {
    color: "#94a3b8",
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  codeValue: {
    color: "#bfdbfe",
    background: "#020617",
    borderRadius: 6,
    padding: "8px 10px",
    overflowX: "auto",
  },
  url: {
    color: "#67e8f9",
    background: "#020617",
    borderRadius: 6,
    padding: "8px 10px",
    lineHeight: 1.4,
    wordBreak: "break-all",
  },
  preview: {
    width: "100%",
    maxHeight: 260,
    objectFit: "contain",
    borderRadius: 10,
    border: "1px solid #243244",
    background: "#020617",
  },
  emptyState: {
    minHeight: 180,
    display: "grid",
    placeItems: "center",
    color: "#64748b",
    textAlign: "center",
    border: "1px dashed #334155",
    borderRadius: 10,
    padding: 18,
  },
};

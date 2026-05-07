import { useState } from "react";
import { z } from "zod";

const PointsSchema = z.number({
}).positive("Debe ser un número positivo").int("Debe ser un número entero");

type ValidationResult =
  | { success: true }
  | { success: false; message: string };

function validate(raw: string): ValidationResult {
  const num = Number(raw);
  const result = PointsSchema.safeParse(isNaN(num) ? raw : num);
  if (result.success) return { success: true };
  return { success: false, message: result.error.errors[0].message };
}

export default function GuardianNexo() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setValue(raw);
    if (raw === "") {
      setResult(null);
      return;
    }
    setResult(validate(raw));
  }

  const borderColor = result === null
    ? "#4a5568"
    : result.success
    ? "#38a169"
    : "#e53e3e";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", padding: "2rem" }}>
      {/* Ícono escudo */}
      <div style={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        border: `4px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "3rem",
        background: "#0f0f1a",
        transition: "border-color 0.3s",
      }}>
        {result === null ? "🛡️" : result.success ? "✅" : "🚫"}
      </div>

      {/* Input */}
      <div style={{ width: "100%", maxWidth: 400 }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#a0aec0" }}>
          Ingresa tus Puntos (Contrato: Número Positivo)
        </label>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          placeholder="Ej: 500"
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            border: `2px solid ${borderColor}`,
            background: "#1a1a2e",
            color: "#e2e8f0",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 0.3s",
            boxSizing: "border-box",
          }}
        />
        {result !== null && !result.success && (
          <p style={{ color: "#fc8181", marginTop: "0.5rem", fontSize: "0.875rem" }}>
            ❌ {result.message}
          </p>
        )}
        {result !== null && result.success && (
          <p style={{ color: "#68d391", marginTop: "0.5rem", fontSize: "0.875rem" }}>
            ✔ Valor válido — el Guardián te deja pasar
          </p>
        )}
      </div>
    </div>
  );
}

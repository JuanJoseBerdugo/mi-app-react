import { useState, useRef } from "react";
import { useForm } from "react-hook-form";

function RenderMonitor({ count }: { count: number }) {
  return (
    <div style={{
      position: "fixed",
      bottom: "1.5rem",
      right: "1.5rem",
      width: 64,
      height: 64,
      borderRadius: "50%",
      background: "#d53f8c",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: "0.65rem",
      fontWeight: 700,
      boxShadow: "0 0 20px #d53f8c88",
      zIndex: 999,
    }}>
      <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{count}</span>
      renders
    </div>
  );
}

export default function EscanerRendimiento() {
  // Estado tradicional — re-renderiza en cada tecla
  const [tradicional, setTradicial] = useState("");
  const renderCount = useRef(0);
  renderCount.current += 1;

  // React Hook Form — no re-renderiza en cada tecla
  const { register } = useForm();

  return (
    <div style={{ padding: "2rem", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{
        background: "#1a1a2e",
        borderRadius: "1rem",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        border: "1px solid #2d3748",
      }}>
        {/* Input tradicional */}
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#a0aec0", fontSize: "0.9rem" }}>
            Estado Tradicional (Lento)
          </label>
          <input
            value={tradicional}
            onChange={(e) => setTradicial(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Input RHF */}
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#a0aec0", fontSize: "0.9rem" }}>
            Hook Form (Optimizado)
          </label>
          <input
            {...register("hookField")}
            style={{ ...inputStyle, borderColor: "#63b3ed" }}
          />
        </div>
      </div>

      <RenderMonitor count={renderCount.current} />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "0.5rem",
  border: "2px solid #4a5568",
  background: "#0f0f1a",
  color: "#e2e8f0",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};

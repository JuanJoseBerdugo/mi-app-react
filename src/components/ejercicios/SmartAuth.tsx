import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserSchema, User } from "../../schemas/UserValidation";

export default function SmartAuth() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = (data: User) => console.log("Datos válidos:", data);

  return (
    <div style={{ padding: "2rem", maxWidth: 480, margin: "0 auto" }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          background: "#1a1a2e",
          border: "1px solid #2d3748",
          borderRadius: "1rem",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {/* Username */}
        <div>
          <label style={labelStyle}>Username (mín. 3, máx. 20 letras)</label>
          <input {...register("username")} placeholder="Ej: NexusUser" style={inputStyle(!!errors.username)} />
          {errors.username && <p style={errorStyle}>✗ {errors.username.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Escribe tu Email Nexus (Schema: @ y .com)</label>
          <input {...register("email")} placeholder="Ej: nexus@gmail.com" style={inputStyle(!!errors.email)} />
          {errors.email
            ? <p style={errorStyle}>✗ {errors.email.message}</p>
            : null}
        </div>

        {/* Points */}
        <div>
          <label style={labelStyle}>Puntos (número entero positivo)</label>
          <input
            type="number"
            {...register("points", { valueAsNumber: true })}
            placeholder="Ej: 500"
            style={inputStyle(!!errors.points)}
          />
          {errors.points && <p style={errorStyle}>✗ {errors.points.message}</p>}
        </div>

        <button
          type="submit"
          style={{
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "#38a169",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.4rem",
  color: "#a0aec0",
  fontSize: "0.9rem",
};

const errorStyle: React.CSSProperties = {
  color: "#fc8181",
  fontSize: "0.8rem",
  marginTop: "0.3rem",
};

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: `2px solid ${hasError ? "#e53e3e" : "#4a5568"}`,
    background: "#0f0f1a",
    color: "#e2e8f0",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  };
}

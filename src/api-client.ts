// ============================================================
// Taller: Master API Client
// ============================================================

// 1. Definir Contratos de Datos
// ✅ Definir Literales de Rol
interface User {
  id: number;
  name: string;
  role: "admin" | "editor" | "viewer";
}

// ============================================================
// 2. Cliente API Genérico
// ✅ Declarar Parámetro Genérico
abstract class APIClient<T> {
  constructor(protected url: string) {}

  // ✅ Tipar Retorno de Lista
  async fetchAll(): Promise<T[]> {
    const res = await fetch(this.url);
    return res.json();
  }

  // ✅ Tipar Retorno Individual
  async fetchById(id: number): Promise<T> {
    const res = await fetch(`${this.url}/${id}`);
    return res.json();
  }
}

// ============================================================
// 3. Implementación con Utilidades
// ✅ Hacer campos opcionales
type UserUpdate = Partial<User>;

// ✅ Seleccionar campos básicos
type UserBasic = Pick<User, "id" | "name">;

// ✅ Excluir campos sensibles
type UserPublic = Omit<User, "role">;

// ✅ Hacer todos los campos obligatorios
type UserRequired = Required<User>;

// ============================================================
// 4. Crear Predicado de Tipo
// ✅ Crear Predicado de Tipo
function isUser(val: unknown): val is User {
  return (
    typeof val === "object" &&
    val !== null &&
    "id" in val &&
    "name" in val &&
    "role" in val
  );
}

// ============================================================
// 5. Tipar Acción del Reducer
// ✅ Tipar Acción del Reducer
type UserAction =
  | { type: "SET_USER"; payload: User }
  | { type: "UPDATE_USER"; payload: UserUpdate }
  | { type: "CLEAR_USER" };

function userReducer(state: User | null, action: UserAction): User | null {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "UPDATE_USER":
      return state ? { ...state, ...action.payload } : null;
    case "CLEAR_USER":
      return null;
    default:
      return state;
  }
}

// ============================================================
// 6. Implementación Concreta del Cliente
class UserClient extends APIClient<User> {
  constructor() {
    super("https://jsonplaceholder.typicode.com/users");
  }
}

// ============================================================
// Exports
export type { User, UserUpdate, UserBasic, UserPublic, UserRequired, UserAction };
export { APIClient, UserClient, isUser, userReducer };

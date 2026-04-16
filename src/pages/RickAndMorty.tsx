import { useState, useEffect, useCallback } from "react";
import { IRickCharacter, IRickListResponse } from "../types";

const BASE_URL = "https://rickandmortyapi.com/api/character";

const statusColor: Record<IRickCharacter["status"], string> = {
  Alive: "#4caf50",
  Dead: "#f44336",
  unknown: "#9e9e9e",
};

export function RickAndMorty() {
  const [characters, setCharacters] = useState<IRickCharacter[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState(BASE_URL);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(currentUrl)
      .then((res) => res.json())
      .then((data: IRickListResponse) => {
        if (!data.results) {
          setCharacters([]);
          setNextUrl(null);
          setPrevUrl(null);
          setNotFound(true);
        } else {
          setNextUrl(data.info.next);
          setPrevUrl(data.info.prev);
          setCharacters(data.results);
        }
        setLoading(false);
      });
  }, [currentUrl]);

  const handleSearch = useCallback(() => {
    const name = search.trim();
    setCurrentUrl(name ? `${BASE_URL}?name=${encodeURIComponent(name)}` : BASE_URL);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClear = () => {
    setSearch("");
    setCurrentUrl(BASE_URL);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        🛸 Rick &amp; Morty
      </h1>

      {/* Buscador */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar personaje..."
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "1px solid #444",
            background: "#1e1e2e",
            color: "#fff",
            fontSize: "0.9rem",
            width: "260px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "0.5rem 1.2rem",
            borderRadius: "8px",
            border: "none",
            background: "#00b5cc",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Buscar
        </button>
        {search && (
          <button
            onClick={handleClear}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              background: "#555",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando personajes...</p>
      ) : notFound ? (
        <p style={{ textAlign: "center", color: "#f44336" }}>
          No se encontró ningún personaje con ese nombre.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "1rem",
          }}
        >
          {characters.map((c) => (
            <div
              key={c.id}
              style={{
                background: "#1e1e2e",
                border: "1px solid #333",
                borderRadius: "12px",
                textAlign: "center",
                padding: "0.75rem 0.5rem",
                color: "#fff",
              }}
            >
              <img
                src={c.image}
                alt={c.name}
                style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }}
              />
              <p
                style={{
                  margin: "0.5rem 0 0.2rem",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                }}
              >
                {c.name}
              </p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "#aaa" }}>
                #{c.id}
              </p>
              <p
                style={{
                  margin: "0.3rem 0 0",
                  fontSize: "0.72rem",
                  fontWeight: "bold",
                  color: statusColor[c.status],
                }}
              >
                ● {c.status}
              </p>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: "#ccc" }}>
                {c.species}
              </p>
              <p
                style={{
                  margin: "0.3rem 0 0",
                  fontSize: "0.65rem",
                  color: "#888",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={c.location.name}
              >
                📍 {c.location.name}
              </p>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <button
          disabled={!prevUrl}
          onClick={() => prevUrl && setCurrentUrl(prevUrl)}
          style={{
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            cursor: prevUrl ? "pointer" : "not-allowed",
            background: prevUrl ? "#00b5cc" : "#555",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Anterior
        </button>
        <button
          disabled={!nextUrl}
          onClick={() => nextUrl && setCurrentUrl(nextUrl)}
          style={{
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            cursor: nextUrl ? "pointer" : "not-allowed",
            background: nextUrl ? "#00b5cc" : "#555",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default RickAndMorty;

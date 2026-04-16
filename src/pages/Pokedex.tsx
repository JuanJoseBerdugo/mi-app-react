import { useState, useEffect } from "react";
import { IPokemon, IPokeListResponse } from "../types";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=50";

function getIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return parseInt(parts[parts.length - 1], 10);
}

export function Pokedex() {
  const [pokemons, setPokemons] = useState<IPokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState(BASE_URL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(currentUrl)
      .then((res) => res.json())
      .then(async (data: IPokeListResponse) => {
        setNextUrl(data.next);
        setPrevUrl(data.previous);
        const details = await Promise.all(
          data.results.map((item) =>
            fetch(item.url).then((r) => r.json())
          )
        );
        setPokemons(details as IPokemon[]);
        setLoading(false);
      });
  }, [currentUrl]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Pokédex</h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando Pokémon...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "1rem",
          }}
        >
          {pokemons.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#1e1e2e",
                border: "1px solid #333",
                borderRadius: "12px",
                textAlign: "center",
                padding: "1rem 0.5rem",
                color: "#fff",
              }}
            >
              <img
                src={p.sprites.front_default}
                alt={p.name}
                style={{ width: 96, height: 96 }}
              />
              <p style={{ margin: "0.4rem 0 0.2rem", fontWeight: "bold", textTransform: "capitalize" }}>
                {p.name}
              </p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#aaa" }}>#{p.id}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 0", fontSize: "0.7rem", color: "#ccc" }}>
                {p.abilities.map((hab) => (
                  <li key={hab.ability.name} style={{ textTransform: "capitalize" }}>
                    {hab.ability.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
        <button
          disabled={!prevUrl}
          onClick={() => prevUrl && setCurrentUrl(prevUrl)}
          style={{
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            cursor: prevUrl ? "pointer" : "not-allowed",
            background: prevUrl ? "#f0c040" : "#555",
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
            background: nextUrl ? "#f0c040" : "#555",
            fontWeight: "bold",
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Pokedex;

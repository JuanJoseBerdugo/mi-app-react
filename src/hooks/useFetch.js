import { useState, useEffect } from 'react';

function useFetch(url) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCargando(true);
    setError(null);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setDatos(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err);
        setCargando(false);
      });
  }, [url]);

  return { datos, cargando, error };
}

export default useFetch;

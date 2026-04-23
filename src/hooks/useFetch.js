import { useState, useEffect } from 'react';

function useFetch(url) {
  const [estado, setEstado] = useState({
    datos: null,
    error: null,
    cargando: true,
    urlCargada: null,
  });

  useEffect(() => {
    let cancelado = false;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelado) {
          setEstado({
            datos: data,
            error: null,
            cargando: false,
            urlCargada: url,
          });
        }
      })
      .catch((err) => {
        if (!cancelado) {
          setEstado({
            datos: null,
            error: err,
            cargando: false,
            urlCargada: url,
          });
        }
      });

    return () => {
      cancelado = true;
    };
  }, [url]);

  const cargando = estado.urlCargada !== url || estado.cargando;
  const error = estado.urlCargada === url ? estado.error : null;
  const datos = estado.urlCargada === url ? estado.datos : null;

  return { datos, cargando, error };
}

export default useFetch;

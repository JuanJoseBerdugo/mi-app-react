import { useState } from 'react'

const comentariosIniciales = [
  {
    id: 1,
    autor: 'Brayan Lopera',
    avatar: 'ML',
    fecha: 'hace 2 horas',
    texto: 'Soy El Yirri',
    likes: 12,
  },
  {
    id: 2,
    autor: 'Vibe-Dugo',
    avatar: 'CR',
    fecha: 'hace 5 horas',
    texto: 'Cuando pagan?',
    likes: 8,
  },
  {
    id: 3,
    autor: 'Vivalex',
    avatar: 'AT',
    fecha: 'hace 1 día',
    texto: 'Mantengo en Pausa Activa',
    likes: 3,
  },
]

function Comentarios() {
  const [comentarios, setComentarios] = useState(comentariosIniciales)
  const [nombre, setNombre] = useState('')
  const [texto, setTexto] = useState('')

  function handleEnviar() {
    if (nombre === '' || texto === '') return

    const nuevo = {
      id: comentarios.length + 1,
      autor: nombre,
      avatar: nombre.slice(0, 2).toUpperCase(),
      fecha: 'ahora mismo',
      texto: texto,
      likes: 0,
    }

    setComentarios([nuevo, ...comentarios])
    setNombre('')
    setTexto('')
  }

  function handleLike(id) {
    setComentarios(
      comentarios.map((c) =>
        c.id === id ? { ...c, likes: c.likes + 1 } : c
      )
    )
  }

  return (
    <section className="comentarios-seccion">
      <h2 className="comentarios-titulo">💬 Comentarios</h2>

      {/* Formulario */}
      <div className="comentarios-form">
        <input
          className="comentarios-input"
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <textarea
          className="comentarios-textarea"
          placeholder="Escribe un comentario..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
        />
        <button className="comentarios-btn" onClick={handleEnviar}>
          Enviar comentario
        </button>
      </div>

      {/* Lista de comentarios */}
      <div className="comentarios-lista">
        {comentarios.map((c) => (
          <div key={c.id} className="comentario-card">
            <div className="comentario-header">
              <div className="comentario-avatar">{c.avatar}</div>
              <div>
                <p className="comentario-autor">{c.autor}</p>
                <p className="comentario-fecha">{c.fecha}</p>
              </div>
            </div>
            <p className="comentario-texto">{c.texto}</p>
            <button className="comentario-like" onClick={() => handleLike(c.id)}>
              👍 {c.likes}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Comentarios

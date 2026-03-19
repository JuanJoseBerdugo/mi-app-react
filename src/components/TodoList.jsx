import { useState, useEffect } from 'react'

const coloresCat = {
  Trabajo: 'badge-trabajo',
  Estudio: 'badge-estudio',
  Ocio:    'badge-ocio',
}

function TodoList() {
  const [texto, setTexto] = useState('')
  const [categoria, setCategoria] = useState('Trabajo')
  const [tareas, setTareas] = useState([])
  const [filtro, setFiltro] = useState('Todas')

  useEffect(() => {
    if (tareas.length >= 4) {
      alert('Felicidades, ahora eres un Vibe-Dugo Master! 🎉');
    }
  }, [tareas])

  function agregarTarea() {
    if (texto === '') return
    const nueva = { id: Date.now(), texto: texto, categoria: categoria }
    setTareas([...tareas, nueva])
    setTexto('')
  }

  function eliminarTarea(id) {
    setTareas(tareas.filter((t) => t.id !== id))
  }

  const tareasFiltradas = filtro === 'Todas'
    ? tareas
    : tareas.filter((t) => t.categoria === filtro)

  return (
    <div className="todo-contenedor">
        
      <h2 className="todo-titulo">Tareas Vibe-Dugo</h2>

      <div className="todo-filtro">
        <span>Filtrar por:</span>

        <select className="todo-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option>Todas</option>
          <option>Trabajo</option>
          <option>Estudio</option>
          <option>Ocio</option>
        </select>

      </div>

      <div className="todo-form">
        
        <input
          className="todo-input"
          type="text"
          placeholder="¿Qué hay que hacer?"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <select
          className="todo-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >

          <option>Trabajo</option>
          <option>Estudio</option>
          <option>Ocio</option>
        </select>

        <button className= "todo_boton_agregar" onClick={agregarTarea}>
          + Tarea
        </button>

      </div>

      <ul className="todo-lista">
        {tareasFiltradas.length === 0 && <p className="todo-vacio">Agregue pues una tarea mijo</p>}
        {tareasFiltradas.map((tarea) => (

          <li key={tarea.id} className="todo-item">
            <div className="todo-item-info">
              <span className="todo-item-texto">{tarea.texto}</span>
              <span className={`todo-badge ${coloresCat[tarea.categoria]}`}>{tarea.categoria}</span>
            </div>

            <button className="todo_boton_eliminar" onClick={() => eliminarTarea(tarea.id)}>
              🗑
            </button>
          </li>

        ))}
      </ul>

      {tareas.length >= 4 && (
        <div className="feedback">
          <span>Felicidades, ahora eres un Vibe-Dugo Master! 🎉</span>
        </div>
      )}

    </div>
  )
}

export default TodoList

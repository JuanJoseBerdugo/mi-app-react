import { useState } from 'react'

function TwitterBox() {
  const [texto, setTexto] = useState('')
  const [tweets, setTweets] = useState([])

  function handlePublicar() {
    if (texto === '') return
    setTweets([texto, ...tweets])
    setTexto('')
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px' }}>
      <h2>Mini Twitter</h2>

      <textarea
        placeholder="¿Qué está pasando?"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={3}
        style={{ width: '100%', fontSize: '1rem', padding: '8px', boxSizing: 'border-box' }}
      />

      <br />

      <button onClick={handlePublicar}>Publicar</button>

      <p>{280 - texto.length} caracteres restantes</p>

      <div>
        {tweets.length === 0 && <p>El feed esta vacío.</p>}

        {tweets.map((tweet, index) => (
          <div key={index} style={{ border: '1px solid gray', padding: '10px', marginTop: '10px', borderRadius: '8px' }}>
            <p>{tweet}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TwitterBox

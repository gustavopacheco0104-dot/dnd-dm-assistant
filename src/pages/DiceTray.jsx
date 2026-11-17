import { useState } from 'react'
import './Pages.css'

const DICE = [4, 6, 8, 10, 12, 20, 100]

function DiceTray() {
  const [selected, setSelected] = useState(20)
  const [result, setResult] = useState(null)
  const [rolls, setRolls] = useState(0)
  const [history, setHistory] = useState([])

  const roll = () => {
    const value = Math.floor(Math.random() * selected) + 1
    setResult({ value, sides: selected })
    setRolls((r) => r + 1)
    setHistory((h) => [{ id: Date.now(), value, sides: selected }, ...h].slice(0, 8))
  }

  let feedback = ''
  if (result && result.sides === 20) {
    if (result.value === 20) feedback = 'crit'
    if (result.value === 1) feedback = 'fail'
  }

  return (
    <section>
      <h1>🎲 Bandeja de dados</h1>

      <div className="dice-grid">
        {DICE.map((d) => (
          <button
            key={d}
            className={selected === d ? 'dice-btn active' : 'dice-btn'}
            onClick={() => setSelected(d)}
          >
            d{d}
          </button>
        ))}
      </div>

      <button className="roll-btn" onClick={roll}>
        Lanzar d{selected}
      </button>

      <div className="result-box">
        {result ? (
          <div key={rolls} className={`result-value ${feedback}`}>
            {result.value}
            <small>d{result.sides}</small>
          </div>
        ) : (
          <p className="muted">Elige un dado y lánzalo</p>
        )}
        {feedback === 'crit' && <p className="crit-text">¡Crítico!</p>}
        {feedback === 'fail' && <p className="fail-text">¡Pifia!</p>}
      </div>

      {history.length > 0 && (
        <div>
          <h2>Historial</h2>
          <ul className="history">
            {history.map((h) => (
              <li key={h.id}>
                d{h.sides}: <strong>{h.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default DiceTray
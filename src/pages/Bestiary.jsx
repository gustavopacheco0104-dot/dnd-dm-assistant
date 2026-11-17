import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import { getMonsters, getMonster } from '../services/api'
import { formatCR } from '../utils/format'
import '../components/Card.css'
import './Pages.css'

const PAGE_SIZE = 12

function getAC(m) {
  return Array.isArray(m.armor_class) ? m.armor_class[0]?.value : m.armor_class
}

function Bestiary() {
  const [list, setList] = useState([])
  const [details, setDetails] = useState({})
  const [query, setQuery] = useState('')
  const [count, setCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMonsters()
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => list.filter((m) => m.name.toLowerCase().includes(query.toLowerCase())),
    [list, query]
  )
  const visible = useMemo(() => filtered.slice(0, count), [filtered, count])

  useEffect(() => {
    const missing = visible.filter((m) => !details[m.index])
    if (missing.length === 0) return
    let cancelled = false

    Promise.all(
      missing.map((m) =>
        getMonster(m.index)
          .then((d) => [m.index, d])
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return
      setDetails((prev) => {
        const next = { ...prev }
        results.forEach((r) => {
          if (r) next[r[0]] = r[1]
        })
        return next
      })
    })

    return () => {
      cancelled = true
    }
  }, [visible, details])

  const handleSearch = (e) => {
    setQuery(e.target.value)
    setCount(PAGE_SIZE)
  }

  return (
    <section>
      <h1>🐉 Bestiario</h1>

      <div className="toolbar">
        <input
          className="input"
          type="search"
          placeholder="Buscar monstruo (ej: goblin, dragon)..."
          value={query}
          onChange={handleSearch}
        />
      </div>

      {loading && <p className="muted">Cargando monstruos...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="muted">No se encontraron monstruos.</p>
      )}

      <div className="card-grid">
        {visible.map((m) => {
          const d = details[m.index]
          return (
            <Card
              key={m.index}
              title={m.name}
              subtitle={d ? `${d.size} ${d.type}` : 'Cargando...'}
              stats={
                d
                  ? [
                      { label: 'AC', value: getAC(d) ?? '-' },
                      { label: 'HP', value: d.hit_points },
                      { label: 'CR', value: formatCR(d.challenge_rating) },
                    ]
                  : []
              }
            >
              {d && (
                <p className="item-desc">
                  {d.alignment} · {d.xp} XP
                </p>
              )}
            </Card>
          )
        })}
      </div>

      {count < filtered.length && (
        <button className="btn center" onClick={() => setCount((c) => c + PAGE_SIZE)}>
          Ver más ({filtered.length - count} restantes)
        </button>
      )}
    </section>
  )
}

export default Bestiary
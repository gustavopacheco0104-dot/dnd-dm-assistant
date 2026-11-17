import { useState } from 'react'
import Card from '../components/Card'
import { getEquipmentList, getMagicItems, getItemByUrl } from '../services/api'
import { formatCR } from '../utils/format'
import '../components/Card.css'
import './Pages.css'

const CR_OPTIONS = [0, 0.125, 0.25, 0.5, ...Array.from({ length: 30 }, (_, i) => i + 1)]

const COIN_META = {
  cp: { label: 'Cobre', icon: '🟤' },
  sp: { label: 'Plata', icon: '⚪' },
  gp: { label: 'Oro', icon: '🟡' },
  pp: { label: 'Platino', icon: 'O' },
}

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const roll = (n, sides) => Array.from({ length: n }, () => rand(1, sides)).reduce((a, b) => a + b, 0)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Cada nivel de desafío cae en un "tier" con monedas, cantidad y calidad distintas
const TIERS = [
  {
    max: 4,
    coins: () => ({ cp: roll(6, 6), sp: roll(3, 6), gp: roll(2, 6) }),
    items: [1, 2], magicChance: 0, rarities: [], minValue: 0, maxValue: 50,
  },
  {
    max: 10,
    coins: () => ({ sp: roll(2, 6) * 10, gp: roll(2, 6) * 10 }),
    items: [2, 3], magicChance: 0.15, rarities: ['Common', 'Uncommon'], minValue: 10, maxValue: 250,
  },
  {
    max: 16,
    coins: () => ({ gp: roll(4, 6) * 100, pp: roll(1, 6) * 10 }),
    items: [2, 4], magicChance: 0.4, rarities: ['Uncommon', 'Rare'], minValue: 50, maxValue: 1000,
  },
  {
    max: Infinity,
    coins: () => ({ gp: roll(12, 6) * 1000, pp: roll(8, 6) * 100 }),
    items: [3, 5], magicChance: 0.7, rarities: ['Rare', 'Very Rare', 'Legendary'], minValue: 100, maxValue: Infinity,
  },
]

const getTier = (cr) => TIERS.find((t) => cr <= t.max)

const GOLD_RATE = { cp: 0.01, sp: 0.1, ep: 0.5, gp: 1, pp: 10 }
const toGold = (cost) => (cost ? cost.quantity * (GOLD_RATE[cost.unit] ?? 1) : 0)

async function pickEquipment(tier, used) {
  const list = await getEquipmentList()
  const candidates = await Promise.all(
    Array.from({ length: 6 }, () => pick(list)).map((b) => getItemByUrl(b.url))
  )
  const fresh = candidates.filter((c) => !used.has(c.index))
  const pool = fresh.length ? fresh : candidates
  const good = pool.filter((c) => {
    const v = toGold(c.cost)
    return v >= tier.minValue && v <= tier.maxValue
  })
  const d = pick(good.length ? good : pool)
  return {
    key: d.index,
    name: d.name,
    magic: false,
    category: d.equipment_category?.name ?? 'Equipo',
    value: d.cost ? `${d.cost.quantity} ${d.cost.unit}` : '-',
    desc: '',
  }
}

async function pickMagic(tier, used) {
  const list = await getMagicItems()
  const candidates = await Promise.all(
    Array.from({ length: 6 }, () => pick(list)).map((b) => getItemByUrl(b.url))
  )
  const fresh = candidates.filter((c) => !used.has(c.index))
  const pool = fresh.length ? fresh : candidates
  const good = pool.filter((c) => tier.rarities.includes(c.rarity?.name))
  const d = pick(good.length ? good : pool)
  return {
    key: d.index,
    name: d.name,
    magic: true,
    category: d.equipment_category?.name ?? 'Objeto mágico',
    value: d.rarity?.name ?? '-',
    desc: (d.desc?.[0] ?? '').slice(0, 140),
  }
}

async function generateLoot(cr) {
  const tier = getTier(cr)
  const coins = tier.coins()
  const total = rand(tier.items[0], tier.items[1])
  const items = []
  const used = new Set()

  for (let i = 0; i < total; i++) {
    const magic = Math.random() < tier.magicChance
    const item = magic ? await pickMagic(tier, used) : await pickEquipment(tier, used)
    used.add(item.key)
    items.push(item)
  }
  return { coins, items }
}

function LootGenerator() {
  const [cr, setCr] = useState(1)
  const [loot, setLoot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      setLoot(await generateLoot(cr))
    } catch (e) {
      setError('No se pudo generar el botín. Revisa tu conexión e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h1> Generador de Loot</h1>

      <div className="toolbar">
        <select className="select" value={cr} onChange={(e) => setCr(Number(e.target.value))}>
          {CR_OPTIONS.map((c) => (
            <option key={c} value={c}>
              Nivel de desafío (CR) {formatCR(c)}
            </option>
          ))}
        </select>
        <button className="btn" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generando...' : 'Generar botín'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {loot && (
        <>
          <h2>Monedas</h2>
          <div className="coins">
            {Object.entries(loot.coins).map(([k, v]) => (
              <div className="coin" key={k}>
                {COIN_META[k].icon} {v} {COIN_META[k].label}
              </div>
            ))}
          </div>

          <h2>Objetos</h2>
          <div className="card-grid">
            {loot.items.map((it) => (
              <Card
                key={it.key}
                title={it.name}
                subtitle={it.category}
                stats={[
                  { label: 'Tipo', value: it.magic ? '✨ Mágico' : 'Equipo' },
                  { label: it.magic ? 'Rareza' : 'Valor', value: it.value },
                ]}
              >
                {it.desc && <p className="item-desc">{it.desc}...</p>}
              </Card>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default LootGenerator
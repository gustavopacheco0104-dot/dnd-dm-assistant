import './Navbar.css'

const SECTIONS = [
  { id: 'bestiary', label: '🐉 Bestiario' },
  { id: 'loot', label: '💰 Loot' },
  { id: 'dice', label: '🎲 Dados' },
]

function Navbar({ current, onChange }) {
  return (
    <nav className="navbar">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          className={current === s.id ? 'nav-btn active' : 'nav-btn'}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </button>
      ))}
    </nav>
  )
}

export default Navbar
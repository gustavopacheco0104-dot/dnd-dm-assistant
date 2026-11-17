import './Card.css'

function Card({ title, subtitle, stats = [], children }) {
  return (
    <article className="card">
      <header>
        <h3 className="card-title">{title}</h3>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </header>

      {stats.length > 0 && (
        <div className="card-stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {children}
    </article>
  )
}

export default Card
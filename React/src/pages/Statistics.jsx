function Statistics({ progress, statusCounts }) {
  const total =
    statusCounts['not-started'] + statusCounts['in-progress'] + statusCounts.completed

  const getPercent = (value) => {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
  }

  const entries = [
    { key: 'not-started', label: 'Не начато' },
    { key: 'in-progress', label: 'В процессе' },
    { key: 'completed', label: 'Завершено' },
  ]

  return (
    <div className="page page-statistics">
      <h1>Статистика</h1>

      <section className="statistics__overall">
        <h2>Общий прогресс</h2>
        <div className="statistics__progress-bar" aria-label="Общий прогресс">
          <div style={{ width: `${progress}%` }} />
        </div>
        <p>{progress}% завершено</p>

        <div className="statistics__bars">
          {entries.map(({ key, label }) => (
            <article key={key} className={`statistics__bar statistics__bar--${key}`}>
              <span>{statusCounts[key]}</span>
              <div>
                <strong>{getPercent(statusCounts[key])}%</strong>
                <p>{label}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Statistics


import { useCallback, useEffect, useState } from 'react'
import './TechnologyResources.css'

function TechnologyResources({ techId, fetchResources }) {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadResources = useCallback(async () => {
    if (!techId || typeof fetchResources !== 'function') {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const items = await fetchResources(techId)
      setResources(items)
    } catch (err) {
      setError(err.message || 'Не удалось загрузить ресурсы')
    } finally {
      setLoading(false)
    }
  }, [techId, fetchResources])

  useEffect(() => {
    loadResources()
  }, [loadResources])

  if (!techId) {
    return null
  }

  return (
    <section className="technology-resources">
      <div className="technology-resources__header">
        <h3>Дополнительные материалы</h3>
        <button type="button" onClick={loadResources} disabled={loading}>
          {loading ? 'Загрузка...' : 'Обновить'}
        </button>
      </div>

      {loading && <p className="technology-resources__status">Загружаем ссылки...</p>}
      {error && <p className="technology-resources__error">Ошибка: {error}</p>}

      {!loading && !error && resources.length === 0 && (
        <p className="technology-resources__status">Пока нет рекомендаций.</p>
      )}

      {!loading && !error && resources.length > 0 && (
        <ul className="technology-resources__list">
          {resources.map((link) => (
            <li key={link}>
              <a href={link} target="_blank" rel="noreferrer">
                {link}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default TechnologyResources


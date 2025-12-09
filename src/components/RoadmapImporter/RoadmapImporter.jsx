import { useState } from 'react'
import './RoadmapImporter.css'

function RoadmapImporter({ onImport }) {
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleImportRoadmap = async () => {
    if (!onImport) return

    try {
      setImporting(true)
      setError(null)
      setMessage(null)

      const count = await onImport()

      setMessage(`Успешно импортировано ${count} технологий`)
    } catch (err) {
      setError(err.message || 'Не удалось импортировать дорожную карту')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="roadmap-importer">
      <h3>Импорт дорожной карты</h3>
      <p className="roadmap-importer__hint">
        Загрузите готовый набор технологий из внешнего источника (имитация API).
      </p>

      <div className="roadmap-importer__actions">
        <button
          type="button"
          className="import-button"
          onClick={handleImportRoadmap}
          disabled={importing}
        >
          {importing ? 'Импорт...' : 'Импортировать пример дорожной карты'}
        </button>
      </div>

      {message && <p className="roadmap-importer__message">{message}</p>}
      {error && <p className="roadmap-importer__error">{error}</p>}
    </div>
  )
}

export default RoadmapImporter


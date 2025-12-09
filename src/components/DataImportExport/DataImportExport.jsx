import { useState } from 'react'
import './DataImportExport.css'

function DataImportExport({ technologies = [], onImport, onExport, onSaveLocal, onLoadLocal }) {
  const [status, setStatus] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const handleExport = () => {
    if (!onExport) return
    onExport()
    setStatus('Данные экспортированы в JSON')
  }

  const handleImport = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result)
        try {
          onImport?.(imported)
          setStatus(`Импортировано ${Array.isArray(imported) ? imported.length : 0} технологий`)
        } catch (err) {
          setStatus(err.message || 'Ошибка импорта: неверный формат файла')
        }
      } catch {
        setStatus('Ошибка импорта: неверный формат файла')
      }
    }

    reader.readAsText(file)
    event.target.value = ''
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file || file.type !== 'application/json') return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result)
        try {
          onImport?.(imported)
          setStatus(`Импортировано ${Array.isArray(imported) ? imported.length : 0} технологий`)
        } catch (err) {
          setStatus(err.message || 'Ошибка импорта: неверный формат файла')
        }
      } catch {
        setStatus('Ошибка импорта: неверный формат файла')
      }
    }
    reader.readAsText(file)
  }

  return (
    <section className="data-transfer" aria-labelledby="data-transfer-title">
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {status}
      </div>
      <div className="data-transfer__header">
        <h3 id="data-transfer-title">Импорт и экспорт данных</h3>
        <p className="data-transfer__hint">
          Экспорт создаёт валидный JSON-файл, импорт использует FileReader и очищает input для повторного выбора.
        </p>
      </div>

      {status && <div className="data-transfer__status">{status}</div>}

      <div className="data-transfer__controls">
        <button type="button" onClick={handleExport} disabled={technologies.length === 0}>
          Экспорт в JSON
        </button>

        <label className="data-transfer__file">
          Импорт из JSON
          <input type="file" accept=".json" onChange={handleImport} />
        </label>

        <button type="button" onClick={onSaveLocal} disabled={technologies.length === 0}>
          Сохранить в localStorage
        </button>
        <button type="button" onClick={onLoadLocal}>
          Загрузить из localStorage
        </button>
      </div>

      <div
        className={`data-transfer__dropzone ${isDragging ? 'is-dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        Перетащите JSON-файл сюда
      </div>
    </section>
  )
}

export default DataImportExport


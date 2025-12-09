import { useEffect, useMemo, useState } from 'react'
import './BulkStatusManager.css'

const STATUS_OPTIONS = [
  { value: 'not-started', label: 'Не начато' },
  { value: 'in-progress', label: 'В процессе' },
  { value: 'completed', label: 'Готово' },
]

function BulkStatusManager({ technologies = [], onApply }) {
  const [selected, setSelected] = useState([])
  const [status, setStatus] = useState('in-progress')
  const [message, setMessage] = useState('')

  const items = useMemo(
    () => technologies.map((tech) => ({ id: tech.id, title: tech.title, status: tech.status })),
    [technologies],
  )

  useEffect(() => {
    if (selected.length === 0) {
      setMessage('')
    }
  }, [selected])

  const toggleSelection = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (selected.length === 0) {
      setMessage('Выберите хотя бы одну технологию')
      return
    }
    onApply?.(selected, status)
    setMessage(`Статус обновлён для ${selected.length} технологий`)
  }

  return (
    <section className="bulk-status" aria-labelledby="bulk-status-title">
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {message}
      </div>
      <div className="bulk-status__header">
        <h3 id="bulk-status-title">Массовое изменение статусов</h3>
        <p className="bulk-status__hint">
          Отмечайте чекбоксами нужные технологии и применяйте статус разом. Все элементы доступны для клавиатуры.
        </p>
      </div>

      <form className="bulk-status__form" onSubmit={handleSubmit}>
        <div className="bulk-status__list" role="group" aria-label="Список технологий">
          {items.map((item) => (
            <label key={item.id} className="bulk-status__item">
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => toggleSelection(item.id)}
                aria-label={`Выбрать ${item.title}`}
              />
              <span className="bulk-status__title">{item.title}</span>
              <span className="bulk-status__badge" data-status={item.status}>
                {STATUS_OPTIONS.find((opt) => opt.value === item.status)?.label || item.status}
              </span>
            </label>
          ))}
          {items.length === 0 && <p className="bulk-status__empty">Технологий пока нет</p>}
        </div>

        <div className="bulk-status__controls">
          <label className="bulk-status__select">
            Новый статус
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="btn btn-primary" disabled={items.length === 0}>
            Применить
          </button>
          {message && <span className="bulk-status__message">{message}</span>}
        </div>
      </form>
    </section>
  )
}

export default BulkStatusManager


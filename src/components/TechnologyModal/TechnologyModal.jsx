import { useEffect } from 'react'
import TechnologyNotes from '../TechnologyNotes/TechnologyNotes'
import TechnologyResources from '../TechnologyResources/TechnologyResources'
import './TechnologyModal.css'

function TechnologyModal({ technology, onClose, onStatusChange, onNotesChange, fetchResources }) {
  const statusLabelMap = {
    'not-started': 'Не начато',
    'in-progress': 'В процессе',
    completed: 'Готово',
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!technology) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="technology-modal__backdrop" onClick={handleBackdropClick}>
      <div className="technology-modal" onClick={(e) => e.stopPropagation()}>
        <button className="technology-modal__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <header className="technology-modal__header">
          <div className="technology-modal__header-content">
            <h2>{technology.title}</h2>
            <span className={`badge badge--${technology.status}`}>
              {statusLabelMap[technology.status]}
            </span>
          </div>
        </header>

        <div className="technology-modal__content">
          <p className="technology-modal__description">{technology.description}</p>
          <p className="technology-modal__category">Категория: {technology.category ?? 'general'}</p>
          {technology.deadline && (
            <p className="technology-modal__deadline">Дедлайн: {technology.deadline}</p>
          )}

          <TechnologyNotes
            notes={technology.notes}
            techId={technology.id}
            onNotesChange={onNotesChange}
          />

          <TechnologyResources techId={technology.id} fetchResources={fetchResources} />
        </div>
      </div>
    </div>
  )
}

export default TechnologyModal


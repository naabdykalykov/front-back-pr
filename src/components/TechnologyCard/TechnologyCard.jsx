import TechnologyNotes from '../TechnologyNotes/TechnologyNotes'
import './TechnologyCard.css'

const STATUS_PRESETS = {
  completed: {
    label: 'Изучено',
    modifier: 'completed',
  },
  'in-progress': {
    label: 'В процессе',
    modifier: 'in-progress',
  },
  'not-started': {
    label: 'К изучению',
    modifier: 'not-started',
  },
}

const STATUS_ORDER = ['not-started', 'in-progress', 'completed']

function TechnologyCard({
  id,
  title,
  description,
  status = 'not-started',
  notes = '',
  deadline,
  onStatusChange,
  onNotesChange,
}) {
  const config = STATUS_PRESETS[status] ?? STATUS_PRESETS['not-started']

  const handleClick = () => {
    const index = STATUS_ORDER.indexOf(status)
    const nextIndex = (index + 1) % STATUS_ORDER.length
    const nextStatus = STATUS_ORDER[nextIndex]
    if (typeof onStatusChange === 'function') {
      onStatusChange(id, nextStatus)
    }
  }

  return (
    <article className={`technology-card technology-card--${config.modifier}`} onClick={handleClick}>
      <header className="technology-card__header">
        <h3 className="technology-card__title">{title}</h3>
        <span className="technology-card__status">{config.label}</span>
      </header>
      {deadline && (
        <p className="technology-card__meta">
          Дедлайн: <strong>{deadline}</strong>
        </p>
      )}
      {description && <p className="technology-card__description">{description}</p>}
      <TechnologyNotes notes={notes} techId={id} onNotesChange={onNotesChange} />
    </article>
  )
}

export default TechnologyCard


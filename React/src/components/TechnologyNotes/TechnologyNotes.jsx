import './TechnologyNotes.css'

function TechnologyNotes({ notes = '', onNotesChange, techId }) {
  const handleChange = (event) => {
    onNotesChange?.(techId, event.target.value)
  }

  const stopPropagation = (event) => {
    event.stopPropagation()
  }

  return (
    <div className="technology-notes" onClick={stopPropagation}>
      <label className="technology-notes__field">
        <span>Моя заметка</span>
        <div className="technology-notes__input-wrapper">
          <input
            type="text"
            value={notes}
            onChange={handleChange}
            onClick={stopPropagation}
            placeholder="Короткая заметка по теме..."
          />
          {notes.length > 0 && <span className="technology-notes__length">{notes.length}</span>}
        </div>
      </label>
      <div className="technology-notes__hint">
        {notes.length > 0 ? 'Заметка сохранена' : 'Добавьте заметку'}
      </div>
    </div>
  )
}

export default TechnologyNotes


import './QuickActions.css'

function QuickActions({ onCompleteAll, onResetAll, onPickRandom }) {
  return (
    <section className="quick-actions">
      <span className="quick-actions__label">Быстрые действия:</span>
      <div className="quick-actions__buttons">
        <button type="button" onClick={onCompleteAll}>
          Отметить все как выполненные
        </button>
        <button type="button" onClick={onResetAll}>
          Сбросить все статусы
        </button>
        <button type="button" onClick={onPickRandom}>
          Случайный выбор следующей технологии
        </button>
      </div>
    </section>
  )
}

export default QuickActions


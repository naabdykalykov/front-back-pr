import './FilterTabs.css'

const FILTERS = [
  { value: 'all', label: 'Все' },
  { value: 'not-started', label: 'Не начаты' },
  { value: 'in-progress', label: 'В процессе' },
  { value: 'completed', label: 'Выполнены' },
]

function FilterTabs({ value = 'all', onChange }) {
  return (
    <div className="filter-tabs">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={value === filter.value ? 'active' : ''}
          onClick={() => onChange?.(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs


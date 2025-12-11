import { useEffect, useRef, useState } from 'react'
import './TechnologySearch.css'

function TechnologySearch({ searchTechnologies, onResultsChange }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resultCount, setResultCount] = useState(0)

  const debounceRef = useRef(null)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const emitResults = (payload) => {
    onResultsChange?.(payload)
    setResultCount(payload.items.length)
  }

  const triggerSearch = async (value) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const normalized = value.trim()

    if (!normalized) {
      setLoading(false)
      setError(null)
      emitResults({ query: '', items: [] })
      return
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const items = await searchTechnologies(normalized, { signal: controller.signal })
      emitResults({ query: normalized, items })
    } catch (err) {
      if (err.name === 'AbortError') {
        return
      }
      setError(err.message || 'Ошибка при поиске технологий')
      emitResults({ query: normalized, items: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    const value = event.target.value
    setQuery(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      triggerSearch(value)
    }, 3000)
  }

  const handleClear = () => {
    setQuery('')
    setError(null)
    emitResults({ query: '', items: [] })
  }

  return (
    <div className="technology-search">
      <label className="technology-search__label">
        <span>Поиск технологий</span>
        <div className="technology-search__field">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Введите название или описание..."
          />
          {query && (
            <button
              type="button"
              className="technology-search__clear"
              onClick={handleClear}
              aria-label="Очистить поиск"
            >
              ×
            </button>
          )}
        </div>
      </label>

      {query && !loading && (
        <p className="technology-search__info">Найдено технологий: {resultCount}</p>
      )}
      {error && <p className="technology-search__error">Ошибка: {error}</p>}
      {!query && (
        <p className="technology-search__hint">Совет: попробуйте «React» или «TypeScript».</p>
      )}
    </div>
  )
}

export default TechnologySearch


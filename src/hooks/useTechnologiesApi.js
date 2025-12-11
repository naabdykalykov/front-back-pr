import { useState, useEffect, useCallback } from 'react'

const mapFromJson = (item) => ({
  id: item.id,
  title: item.title,
  description: item.description || 'Описание отсутствует',
  category: item.category || 'other',
  difficulty: item.difficulty || 'beginner',
  status: item.status || 'not-started',
  notes: item.notes || '',
  deadline: item.deadline || '',
  resources: Array.isArray(item.resources) ? item.resources : [],
})

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTechnologies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const dataUrl = `${import.meta.env.BASE_URL}data/technologies.json`
      const response = await fetch(dataUrl)
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`)
      }
      const data = await response.json()
      const items = Array.isArray(data) ? data.map(mapFromJson) : []
      setTechnologies(items)
    } catch (err) {
      setError('Не удалось загрузить технологии')
      console.error('Ошибка загрузки:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const addTechnology = useCallback(async (techData) => {
    try {
      await delay(500)

      const newTech = {
        id: Date.now(),
        title: techData.title,
        description: techData.description || '',
        category: techData.category || 'frontend',
        difficulty: techData.difficulty || 'beginner',
        status: techData.status || 'not-started',
        notes: techData.notes || '',
        deadline: techData.deadline || '',
        resources: techData.resources || [],
        createdAt: new Date().toISOString(),
      }

      setTechnologies((prev) => [...prev, newTech])
      return newTech
    } catch (err) {
      throw new Error('Не удалось добавить технологию')
    }
  }, [])

  const updateStatus = useCallback((techId, newStatus) => {
    setTechnologies((prev) =>
      prev.map((tech) => (tech.id === techId ? { ...tech, status: newStatus } : tech)),
    )
  }, [])

  const updateStatusesBulk = useCallback((ids, newStatus) => {
    if (!Array.isArray(ids) || ids.length === 0) return
    setTechnologies((prev) =>
      prev.map((tech) => (ids.includes(tech.id) ? { ...tech, status: newStatus } : tech)),
    )
  }, [])

  const updateNotes = useCallback((techId, newNotes) => {
    setTechnologies((prev) =>
      prev.map((tech) => (tech.id === techId ? { ...tech, notes: newNotes } : tech)),
    )
  }, [])

  const updateDeadline = useCallback((techId, deadline, comment = '') => {
    setTechnologies((prev) =>
      prev.map((tech) =>
        tech.id === techId ? { ...tech, deadline: deadline || '', deadlineComment: comment } : tech,
      ),
    )
  }, [])

  const searchTechnologies = useCallback(
    async (query, { signal } = {}) => {
      const normalized = query.trim().toLowerCase()

      if (!normalized) {
        return []
      }

      await delay(600)

      if (signal?.aborted) {
        const abortError = new Error('Запрос отменён')
        abortError.name = 'AbortError'
        throw abortError
      }

      return technologies.filter((tech) => {
        const haystack = `${tech.title} ${tech.description}`.toLowerCase()
        return haystack.includes(normalized)
      })
    },
    [technologies],
  )

  const fetchResources = useCallback(
    async (techId) => {
      const technology = technologies.find((item) => item.id === techId)
      if (!technology) {
        throw new Error('Технология не найдена')
      }
      return technology.resources || []
    },
    [technologies],
  )

  const importRoadmap = useCallback(async () => {
    const dataUrl = `${import.meta.env.BASE_URL}data/technologies.json`
    const response = await fetch(dataUrl)
    if (!response.ok) {
      throw new Error('Не удалось импортировать дорожную карту')
    }
    const data = await response.json()
    const items = Array.isArray(data) ? data.map(mapFromJson) : []
    // возьмём любые 3 новых элемента, которых нет в стейте
    const existingIds = new Set(technologies.map((t) => t.id))
    const roadmap = items.filter((t) => !existingIds.has(t.id)).slice(0, 3)
    setTechnologies((prev) => [...prev, ...roadmap])
    return roadmap.length
  }, [technologies])

  const exportToJson = useCallback(
    (filename = `technologies_${new Date().toISOString().split('T')[0]}.json`) => {
      const dataStr = JSON.stringify(technologies, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    [technologies],
  )

  const importFromJson = useCallback((jsonArray) => {
    if (!Array.isArray(jsonArray)) {
      throw new Error('Неверный формат данных')
    }
    setTechnologies(jsonArray)
  }, [])

  const resetToDefaults = useCallback(() => {
    fetchTechnologies()
  }, [fetchTechnologies])

  const clearTechnologies = useCallback(() => {
    setTechnologies([])
  }, [])

  const progress =
    technologies.length === 0
      ? 0
      : Math.round(
          (technologies.filter((tech) => tech.status === 'completed').length / technologies.length) *
            100,
        )

  const statusCounts = {
    'not-started': technologies.filter((tech) => tech.status === 'not-started').length,
    'in-progress': technologies.filter((tech) => tech.status === 'in-progress').length,
    completed: technologies.filter((tech) => tech.status === 'completed').length,
  }

  useEffect(() => {
    fetchTechnologies()
  }, [fetchTechnologies])

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    updateStatus,
    updateStatusesBulk,
    updateNotes,
    updateDeadline,
    searchTechnologies,
    fetchResources,
    importRoadmap,
    resetToDefaults,
    clearTechnologies,
    setTechnologies,
    exportToJson,
    importFromJson,
    progress,
    statusCounts,
  }
}

export default useTechnologiesApi


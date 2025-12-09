import { useState, useEffect, useCallback } from 'react'

const mockTechnologies = [
  {
    id: 1,
    title: 'React',
    description: 'Библиотека для создания пользовательских интерфейсов',
    category: 'frontend',
    difficulty: 'beginner',
    status: 'not-started',
    notes: '',
    deadline: '',
    resources: ['https://react.dev', 'https://ru.reactjs.org'],
  },
  {
    id: 2,
    title: 'Node.js',
    description: 'Среда выполнения JavaScript на сервере',
    category: 'backend',
    difficulty: 'intermediate',
    status: 'not-started',
    notes: '',
    deadline: '',
    resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/'],
  },
  {
    id: 3,
    title: 'TypeScript',
    description: 'Типизированное надмножество JavaScript',
    category: 'language',
    difficulty: 'intermediate',
    status: 'in-progress',
    notes: '',
    deadline: '',
    resources: ['https://www.typescriptlang.org'],
  },
  {
    id: 4,
    title: 'React Router',
    description: 'Настройка клиентского роутинга и защищённых маршрутов',
    category: 'frontend',
    difficulty: 'beginner',
    status: 'not-started',
    notes: '',
    deadline: '',
    resources: ['https://reactrouter.com'],
  },
  {
    id: 5,
    title: 'State Management',
    description: 'Работа с состоянием компонентов и хуками',
    category: 'frontend',
    difficulty: 'intermediate',
    status: 'in-progress',
    notes: '',
    deadline: '',
    resources: ['https://react.dev/learn/managing-state'],
  },
  {
    id: 6,
    title: 'Testing Library',
    description: 'Написание модульных тестов для компонентов',
    category: 'frontend',
    difficulty: 'advanced',
    status: 'completed',
    notes: '',
    deadline: '',
    resources: ['https://testing-library.com'],
  },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTechnologies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      await delay(1000)

      setTechnologies(mockTechnologies.map((tech) => ({ ...tech })))
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

      await delay(800)

      if (!technology) {
        throw new Error('Технология не найдена')
      }

      const extraResources = [
        `https://example.com/tutorials/${technology.title.toLowerCase().replace(/\s+/g, '-')}`,
        `https://example.com/courses/${techId}`,
      ]

      return [...(technology.resources || []), ...extraResources]
    },
    [technologies],
  )

  const importRoadmap = useCallback(async () => {
    await delay(1200)

    const roadmapTechnologies = [
      {
        id: Date.now(),
        title: 'GraphQL',
        description: 'Язык запросов для API',
        category: 'backend',
        difficulty: 'intermediate',
        status: 'not-started',
        notes: '',
        resources: ['https://graphql.org'],
      },
      {
        id: Date.now() + 1,
        title: 'Docker',
        description: 'Контейнеризация приложений',
        category: 'devops',
        difficulty: 'intermediate',
        status: 'not-started',
        notes: '',
        resources: ['https://docker.com'],
      },
      {
        id: Date.now() + 2,
        title: 'Kubernetes',
        description: 'Оркестрация контейнеров',
        category: 'devops',
        difficulty: 'advanced',
        status: 'not-started',
        notes: '',
        resources: ['https://kubernetes.io'],
      },
    ]

    setTechnologies((prev) => [...prev, ...roadmapTechnologies])
    return roadmapTechnologies.length
  }, [])

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
    setTechnologies(mockTechnologies.map((tech) => ({ ...tech })))
  }, [])

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


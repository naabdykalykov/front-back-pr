import useLocalStorage from './useLocalStorage'

export const initialTechnologies = [
  {
    id: 1,
    title: 'React Components',
    description: 'Изучение базовых компонентов и композиции.',
    status: 'not-started',
    notes: '',
    category: 'frontend',
  },
  {
    id: 2,
    title: 'Node.js Basics',
    description: 'Основы серверного JavaScript и работа с Express.',
    status: 'not-started',
    notes: '',
    category: 'backend',
  },
  {
    id: 3,
    title: 'State Management',
    description: 'Работа с состоянием компонентов и хуками.',
    status: 'in-progress',
    notes: '',
    category: 'frontend',
  },
  {
    id: 4,
    title: 'React Router',
    description: 'Настройка клиентского роутинга и защищённых маршрутов.',
    status: 'not-started',
    notes: '',
    category: 'frontend',
  },
  {
    id: 5,
    title: 'Form Handling',
    description: 'Работа с управляемыми формами и валидацией.',
    status: 'in-progress',
    notes: '',
    category: 'frontend',
  },
  {
    id: 6,
    title: 'Testing Library',
    description: 'Написание модульных тестов для компонентов.',
    status: 'not-started',
    notes: '',
    category: 'frontend',
  },
  {
    id: 7,
    title: 'Performance Optimization',
    description: 'Мемоизация, code-splitting и оптимизация рендеров.',
    status: 'completed',
    notes: '',
    category: 'frontend',
  },
]

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies)

  const updateStatus = (techId, newStatus) => {
    setTechnologies((prev) =>
      prev.map((tech) => (tech.id === techId ? { ...tech, status: newStatus } : tech)),
    )
  }

  const updateNotes = (techId, newNotes) => {
    setTechnologies((prev) =>
      prev.map((tech) => (tech.id === techId ? { ...tech, notes: newNotes } : tech)),
    )
  }

  const calculateProgress = () => {
    if (technologies.length === 0) return 0
    const completed = technologies.filter((tech) => tech.status === 'completed').length
    return Math.round((completed / technologies.length) * 100)
  }

  return {
    technologies,
    setTechnologies,
    updateStatus,
    updateNotes,
    progress: calculateProgress(),
  }
}

export default useTechnologies


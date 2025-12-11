import { useState, useMemo, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import Navigation from './components/Navigation/Navigation'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import TechnologyList from './pages/TechnologyList.jsx'
import AddTechnology from './pages/AddTechnology.jsx'
import Statistics from './pages/Statistics.jsx'
import Dashboard from './components/Dashboard/Dashboard'
import NotificationSnackbar from './components/NotificationSnackbar/NotificationSnackbar'
import useTechnologiesApi from './hooks/useTechnologiesApi'
import './App.css'

function App() {
  const {
    technologies,
    loading,
    error,
    refetch,
    addTechnology,
    updateStatus,
    updateStatusesBulk,
    updateNotes,
    updateDeadline,
    searchTechnologies,
    fetchResources,
    importRoadmap,
    resetToDefaults,
    setTechnologies,
    exportToJson,
    importFromJson,
    progress,
    statusCounts,
  } = useTechnologiesApi()

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('isLoggedIn') === 'true'
  })
  const [username, setUsername] = useState(() => {
    if (typeof window === 'undefined') return ''
    return window.localStorage.getItem('username') || ''
  })

  // Состояние для темы (светлая/тёмная)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = window.localStorage.getItem('themeMode')
    return saved === 'dark'
  })

  // Состояние для уведомлений
  const [notification, setNotification] = useState(null)

  // Создание темы Material-UI с улучшенными цветами
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: isDarkMode ? '#64b5f6' : '#1976d2',
            light: isDarkMode ? '#90caf9' : '#42a5f5',
            dark: isDarkMode ? '#42a5f5' : '#1565c0',
            contrastText: isDarkMode ? '#000000' : '#ffffff',
          },
          secondary: {
            main: isDarkMode ? '#f48fb1' : '#dc004e',
            light: isDarkMode ? '#f8bbd0' : '#ff5983',
            dark: isDarkMode ? '#c2185b' : '#9a0036',
            contrastText: '#ffffff',
          },
          background: {
            default: isDarkMode ? '#121212' : '#f5f7fb',
            paper: isDarkMode ? '#1e1e1e' : '#ffffff',
          },
          text: {
            primary: isDarkMode ? '#ffffff' : '#0f172a',
            secondary: isDarkMode ? '#b0b0b0' : '#6b7280',
          },
          divider: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          action: {
            active: isDarkMode ? '#ffffff' : '#0f172a',
            hover: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            selected: isDarkMode ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
            disabled: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
                border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #e5e7eb',
                boxShadow: isDarkMode
                  ? '0px 2px 8px rgba(0, 0, 0, 0.3)'
                  : '0px 2px 8px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
                border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #e5e7eb',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#0f172a',
                borderBottom: isDarkMode
                  ? '1px solid rgba(255, 255, 255, 0.12)'
                  : '1px solid #e5e7eb',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: '8px',
              },
            },
          },
        },
      }),
    [isDarkMode],
  )

  // Переключение темы
  const handleThemeToggle = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('themeMode', newMode ? 'dark' : 'light')
      // Устанавливаем атрибут для CSS
      document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light')
      document.body.setAttribute('data-theme', newMode ? 'dark' : 'light')
    }
  }

  // Устанавливаем тему при загрузке
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = isDarkMode ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', theme)
      document.body.setAttribute('data-theme', theme)
    }
  }, [isDarkMode])

  // Показ уведомления
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
  }

  // Закрытие уведомления
  const handleNotificationClose = () => {
    setNotification(null)
  }

  const total = technologies.length
  const completed = statusCounts.completed
  const completion = progress

  const handleStatusChange = (id, nextStatus) => {
    updateStatus(id, nextStatus)
    const statusMessages = {
      completed: 'Технология завершена',
      'in-progress': 'Технология в процессе изучения',
      'not-started': 'Технология приостановлена',
    }
    showNotification(statusMessages[nextStatus] || 'Статус обновлён', 'success')
  }

  const handleCompleteAll = () => {
    setTechnologies((prev) => prev.map((tech) => ({ ...tech, status: 'completed' })))
  }

  const handleResetAll = () => {
    resetToDefaults()
  }

  const handlePickRandom = () => {
    const pool = technologies.filter((tech) => tech.status !== 'completed')
    if (pool.length === 0) {
      return
    }
    const target = pool[Math.floor(Math.random() * pool.length)]
    handleStatusChange(target.id, 'in-progress')
  }

  const updateTechnologyNotes = (techId, newNotes) => {
    updateNotes(techId, newNotes)
  }

  const handleDeadlineSave = (techId, payload) => {
    updateDeadline(techId, payload.deadline, payload.comment)
  }

  const handleBulkStatusChange = (ids, status) => {
    updateStatusesBulk(ids, status)
  }

  const handleExportJson = () => {
    exportToJson()
    showNotification('Данные экспортированы в JSON', 'success')
  }

  const handleImportJson = (data) => {
    try {
      importFromJson(data)
      const count = Array.isArray(data) ? data.length : 0
      showNotification(`Импортировано ${count} технологий`, 'success')
    } catch (e) {
      console.error('Импорт отклонён: неверный формат', e)
      showNotification('Ошибка импорта: неверный формат файла', 'error')
    }
  }

  const handleSaveLocal = () => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('technologies', JSON.stringify(technologies))
  }

  const handleLoadLocal = () => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem('technologies')
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      importFromJson(parsed)
    } catch (e) {
      console.error('Ошибка чтения из localStorage', e)
    }
  }

  const handleAddTechnology = (payload) => {
    addTechnology(payload)
    showNotification('Технология успешно добавлена', 'success')
  }

  const handleLogin = (user) => {
    setIsLoggedIn(true)
    setUsername(user)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('isLoggedIn', 'true')
      window.localStorage.setItem('username', user)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('isLoggedIn')
      window.localStorage.removeItem('username')
    }
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Загрузка технологий...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-loading">
        <h2>Произошла ошибка</h2>
        <p>{error}</p>
        <button onClick={refetch} className="retry-button">
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="app-layout">
        <Navigation
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
        />
        <main className="app">
          <Routes>
            <Route
              path="/"
              element={<Home isLoggedIn={isLoggedIn} username={username} onLogin={handleLogin} />}
            />
            <Route
              path="/technologies"
              element={
                <TechnologyList
                  technologies={technologies}
                  statusCounts={statusCounts}
                  onStatusChange={handleStatusChange}
                  onNotesChange={updateTechnologyNotes}
                  onCompleteAll={handleCompleteAll}
                  onResetAll={handleResetAll}
                  onPickRandom={handlePickRandom}
                  searchTechnologies={searchTechnologies}
                  onImportRoadmap={importRoadmap}
                  fetchResources={fetchResources}
                  onDeadlineSave={handleDeadlineSave}
                  onBulkStatusChange={handleBulkStatusChange}
                  onExportJson={handleExportJson}
                  onImportJson={handleImportJson}
                  onSaveLocal={handleSaveLocal}
                  onLoadLocal={handleLoadLocal}
                />
              }
            />
            <Route
              path="/add-technology"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <AddTechnology
                    onAddTechnology={handleAddTechnology}
                    technologies={technologies}
                    onExportJson={handleExportJson}
                    onImportJson={handleImportJson}
                    onSaveLocal={handleSaveLocal}
                    onLoadLocal={handleLoadLocal}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={<Statistics progress={completion} statusCounts={statusCounts} />}
            />
            <Route path="/dashboard" element={<Dashboard technologies={technologies} />} />
          </Routes>
        </main>
        <NotificationSnackbar notification={notification} onClose={handleNotificationClose} />
      </div>
    </ThemeProvider>
  )
}

export default App


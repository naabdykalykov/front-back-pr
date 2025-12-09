import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation/Navigation'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import TechnologyList from './pages/TechnologyList.jsx'
import AddTechnology from './pages/AddTechnology.jsx'
import Statistics from './pages/Statistics.jsx'
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
    updateNotes,
    searchTechnologies,
    fetchResources,
    importRoadmap,
    resetToDefaults,
    setTechnologies,
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

  const total = technologies.length
  const completed = statusCounts.completed
  const completion = progress

  const handleStatusChange = (id, nextStatus) => {
    updateStatus(id, nextStatus)
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

  const handleAddTechnology = (payload) => {
    addTechnology(payload)
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
    <div className="app-layout">
      <Navigation isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
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
              />
            }
          />
          <Route
            path="/add-technology"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <AddTechnology onAddTechnology={handleAddTechnology} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={<Statistics progress={completion} statusCounts={statusCounts} />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App

import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import './Navigation.css'

function Navigation({ isLoggedIn, username, onLogout, isDarkMode, onThemeToggle }) {
  const location = useLocation()

  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <Link to="/">
          <h2>🚀 Трекер технологий</h2>
        </Link>
      </div>

      <ul className="nav-menu">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Главная
          </Link>
        </li>
        <li>
          <Link
            to="/technologies"
            className={location.pathname === '/technologies' ? 'active' : ''}
          >
            Все технологии
          </Link>
        </li>
        <li>
          <Link
            to="/statistics"
            className={location.pathname === '/statistics' ? 'active' : ''}
          >
            Статистика
          </Link>
        </li>
        {isLoggedIn && (
          <>
            <li>
              <Link
                to="/dashboard"
                className={location.pathname === '/dashboard' ? 'active' : ''}
              >
                Панель управления
              </Link>
            </li>
            <li>
              <Link
                to="/add-technology"
                className={location.pathname === '/add-technology' ? 'active' : ''}
              >
                Добавить технологию
              </Link>
            </li>
          </>
        )}
      </ul>

      <div className="nav-user">
        {isLoggedIn && onThemeToggle && (
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onThemeToggle} />
        )}
        {isLoggedIn ? (
          <>
            {username && <span className="nav-username">{username}</span>}
            <button type="button" onClick={onLogout}>
              Выйти
            </button>
          </>
        ) : (
          <Link to="/" className="btn btn-secondary">
            Войти
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navigation


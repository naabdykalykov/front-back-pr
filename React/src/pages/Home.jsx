import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Home({ isLoggedIn, username, onLogin }) {
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const navigate = useNavigate()

  const handleLoginSubmit = (event) => {
    event.preventDefault()

    if (loginUsername === 'admin' && loginPassword === 'password') {
      onLogin?.(loginUsername)
      navigate('/technologies', { replace: true })
    } else {
      alert('Неверные данные для входа')
    }
  }

  if (isLoggedIn) {
    return (
      <div className="page page-home">
        <section className="page-home__hero">
          <h1>Добро пожаловать, {username || 'пользователь'}!</h1>
          <p>Управляйте своим прогрессом в изучении технологий</p>
          <div className="page-home__cta">
            <Link to="/technologies" className="btn btn-primary">
              Перейти к списку технологий
            </Link>
            <Link to="/statistics" className="btn btn-secondary">
              Посмотреть статистику
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page page-home">
      <section className="page-home__hero">
        <h1>Трекер изучения технологий</h1>
        <p>Войдите, чтобы начать управлять своим прогрессом</p>
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <label>
            Имя пользователя
            <input
              type="text"
              value={loginUsername}
              onChange={(event) => setLoginUsername(event.target.value)}
              placeholder="admin"
              required
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              placeholder="password"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Войти
          </button>
        </form>
      </section>
    </div>
  )
}

export default Home


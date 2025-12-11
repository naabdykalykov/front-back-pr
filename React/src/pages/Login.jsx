import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()

    if (username === 'admin' && password === 'password') {
      onLogin?.(username)
      navigate('/dashboard')
    } else {
      alert('Неверные данные для входа')
    }
  }

  return (
    <div className="page page-login">
      <h1>Вход</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Имя пользователя
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Войти
        </button>
      </form>
    </div>
  )
}

export default Login


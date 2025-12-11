import { useEffect, useState } from 'react'

function readValue(key, initialValue) {
  if (typeof window === 'undefined') {
    return initialValue
  }

  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  } catch {
    return initialValue
  }
}

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => readValue(key, initialValue))

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

export default useLocalStorage


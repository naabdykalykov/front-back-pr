import { useEffect, useMemo, useState } from 'react'
import './StudyDeadlineForm.css'

function StudyDeadlineForm({ technologies = [], onSave }) {
  const [formData, setFormData] = useState({
    techId: '',
    deadline: '',
    comment: '',
  })
  const [errors, setErrors] = useState({})
  const [isFormValid, setIsFormValid] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const technologyOptions = useMemo(
    () => technologies.map((tech) => ({ value: tech.id, label: tech.title })),
    [technologies],
  )

  useEffect(() => {
    if (technologyOptions.length > 0 && !formData.techId) {
      setFormData((prev) => ({ ...prev, techId: String(technologyOptions[0].value) }))
    }
  }, [technologyOptions, formData.techId])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.techId) {
      newErrors.techId = 'Выберите технологию'
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Укажите дедлайн'
    } else {
      const deadlineDate = new Date(formData.deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (deadlineDate < today) {
        newErrors.deadline = 'Дедлайн не может быть в прошлом'
      }
    }

    if (formData.comment && formData.comment.trim().length < 5) {
      newErrors.comment = 'Комментарий должен быть не короче 5 символов'
    }

    const valid = Object.keys(newErrors).length === 0
    setErrors(newErrors)
    setIsFormValid(valid)
    return valid
  }

  useEffect(() => {
    validateForm()
  }, [formData])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const valid = validateForm()
    if (!valid) return

    try {
      setIsSubmitting(true)
      setStatusMessage('')
      await onSave?.(Number(formData.techId), {
        deadline: formData.deadline,
        comment: formData.comment.trim(),
      })
      setStatusMessage('Срок успешно сохранён')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="deadline-form" aria-labelledby="deadline-form-title">
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isSubmitting && 'Сохранение срока...'}
        {statusMessage && statusMessage}
      </div>

      <div className="deadline-form__header">
        <h3 id="deadline-form-title">Планирование сроков</h3>
        <p className="deadline-form__hint">
          Валидация в реальном времени: дедлайн не может быть в прошлом, сообщения об ошибках доступные для скринридеров.
        </p>
      </div>

      <form className="deadline-form__fields" onSubmit={handleSubmit} noValidate>
        <div className="deadline-form__field">
          <label htmlFor="deadline-tech" className="required">
            Технология
          </label>
          <select
            id="deadline-tech"
            name="techId"
            value={formData.techId}
            onChange={handleChange}
            aria-invalid={!!errors.techId}
            aria-describedby={errors.techId ? 'deadline-tech-error' : undefined}
          >
            {technologyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.techId && (
            <span id="deadline-tech-error" className="error-message" role="alert">
              {errors.techId}
            </span>
          )}
        </div>

        <div className="deadline-form__field">
          <label htmlFor="deadline-date" className="required">
            Дедлайн
          </label>
          <input
            id="deadline-date"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            aria-invalid={!!errors.deadline}
            aria-describedby={errors.deadline ? 'deadline-date-error' : undefined}
          />
          {errors.deadline && (
            <span id="deadline-date-error" className="error-message" role="alert">
              {errors.deadline}
            </span>
          )}
        </div>

        <div className="deadline-form__field">
          <label htmlFor="deadline-comment">
            Комментарий (необязательно)
          </label>
          <textarea
            id="deadline-comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={3}
            aria-invalid={!!errors.comment}
            aria-describedby={errors.comment ? 'deadline-comment-error' : undefined}
            placeholder="Например: уделить больше времени практике"
          />
          {errors.comment && (
            <span id="deadline-comment-error" className="error-message" role="alert">
              {errors.comment}
            </span>
          )}
        </div>

        <div className="deadline-form__actions">
          <button type="submit" className="btn btn-primary" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить срок'}
          </button>
          {statusMessage && <span className="deadline-form__success">{statusMessage}</span>}
        </div>
      </form>
    </section>
  )
}

export default StudyDeadlineForm


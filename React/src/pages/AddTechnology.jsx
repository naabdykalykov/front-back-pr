import { useState } from 'react'
import DataImportExport from '../components/DataImportExport/DataImportExport'

const categories = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'devops', label: 'DevOps' },
]

function AddTechnology({
  onAddTechnology,
  technologies = [],
  onExportJson,
  onImportJson,
  onSaveLocal,
  onLoadLocal,
}) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'frontend',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return

    onAddTechnology?.({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      status: 'not-started',
      notes: '',
    })

    setForm({
      title: '',
      description: '',
      category: 'frontend',
    })
  }

  return (
    <div className="page page-add-technology">
      <h1>Добавить технологию</h1>
      <form className="technology-form" onSubmit={handleSubmit}>
        <label>
          Название
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Например, GraphQL"
            required
          />
        </label>

        <label>
          Описание
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Коротко опишите, что хотите изучить"
            rows={4}
          />
        </label>

        <label>
          Категория
          <select name="category" value={form.category} onChange={handleChange}>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="btn btn-primary">
          Добавить
        </button>
      </form>

      <DataImportExport
        technologies={technologies}
        onExport={onExportJson}
        onImport={onImportJson}
        onSaveLocal={onSaveLocal}
        onLoadLocal={onLoadLocal}
      />
    </div>
  )
}

export default AddTechnology


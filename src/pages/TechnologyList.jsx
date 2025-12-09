import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box } from '@mui/material'
import QuickActions from '../components/QuickActions/QuickActions'
import FilterTabs from '../components/FilterTabs/FilterTabs'
import TechnologyCard from '../components/TechnologyCard/TechnologyCard'
import SimpleTechCard from '../components/SimpleTechCard/SimpleTechCard'
import RoadmapImporter from '../components/RoadmapImporter/RoadmapImporter'
import TechnologySearch from '../components/TechnologySearch/TechnologySearch'
import TechnologyModal from '../components/TechnologyModal/TechnologyModal'
import StudyDeadlineForm from '../components/StudyDeadlineForm/StudyDeadlineForm'
import BulkStatusManager from '../components/BulkStatusManager/BulkStatusManager'
import DataImportExport from '../components/DataImportExport/DataImportExport'

function TechnologyList({
  technologies,
  statusCounts,
  onStatusChange,
  onNotesChange,
  onCompleteAll,
  onResetAll,
  onPickRandom,
  searchTechnologies,
  onImportRoadmap,
  fetchResources,
  onDeadlineSave,
  onBulkStatusChange,
  onExportJson,
  onImportJson,
  onSaveLocal,
  onLoadLocal,
}) {
  const [filter, setFilter] = useState('all')
  const [searchState, setSearchState] = useState({ query: '', items: [] })
  const [selectedTechnology, setSelectedTechnology] = useState(null)
  const [useMaterialCards, setUseMaterialCards] = useState(false)

  const sourceList = searchState.query ? searchState.items : technologies

  const filteredTechnologies = useMemo(() => {
    return sourceList.filter((tech) => {
      const matchesFilter = filter === 'all' ? true : tech.status === filter
      return matchesFilter
    })
  }, [sourceList, filter])

  const handleSearchResults = ({ query, items }) => {
    setSearchState({ query, items })
  }

  const handleOpenModal = (tech) => {
    setSelectedTechnology(tech)
  }

  const handleCloseModal = () => {
    setSelectedTechnology(null)
  }

  return (
    <div className="page page-technologies">
      <QuickActions
        onCompleteAll={onCompleteAll}
        onResetAll={onResetAll}
        onPickRandom={onPickRandom}
      />

      <StudyDeadlineForm technologies={technologies} onSave={onDeadlineSave} />

      <BulkStatusManager technologies={technologies} onApply={onBulkStatusChange} />

      <DataImportExport
        technologies={technologies}
        onExport={onExportJson}
        onImport={onImportJson}
        onSaveLocal={onSaveLocal}
        onLoadLocal={onLoadLocal}
      />

      <RoadmapImporter onImport={onImportRoadmap} />

      <TechnologySearch
        searchTechnologies={searchTechnologies}
        onResultsChange={handleSearchResults}
      />

      {searchState.query && (
        <p className="technology-list__search-info">
          Показаны результаты по запросу «{searchState.query}». Найдено: {sourceList.length}
        </p>
      )}

      <FilterTabs value={filter} onChange={setFilter} />

      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={useMaterialCards}
            onChange={(e) => setUseMaterialCards(e.target.checked)}
          />
          <span>Использовать Material-UI карточки</span>
        </label>
      </div>

      {filteredTechnologies.length === 0 ? (
        <div className="technology-list__empty">
          <p>Ничего не найдено.</p>
          <p>Попробуйте изменить фильтры, сбросить поиск или импортировать дорожную карту.</p>
          <Link to="/add-technology" className="btn btn-secondary">
            Добавить технологию
          </Link>
        </div>
      ) : useMaterialCards ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 2 }}>
          {filteredTechnologies.map((tech) => (
            <SimpleTechCard
              key={tech.id}
              technology={tech}
              onStatusChange={onStatusChange}
            />
          ))}
        </Box>
      ) : (
        <section className="app__grid">
          {filteredTechnologies.map((tech) => (
            <div key={tech.id} className="technology-list__card">
              <TechnologyCard
                id={tech.id}
                title={tech.title}
                description={tech.description}
                status={tech.status}
                notes={tech.notes}
                onNotesChange={onNotesChange}
                onStatusChange={onStatusChange}
              />
              <div className="technology-list__footer">
                <button
                  type="button"
                  className="technology-list__detail-link"
                  onClick={() => handleOpenModal(tech)}
                >
                  Подробнее →
                </button>
                <span className="technology-list__category">{tech.category ?? 'general'}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {selectedTechnology && (
        <TechnologyModal
          technology={selectedTechnology}
          onClose={handleCloseModal}
          onStatusChange={onStatusChange}
          onNotesChange={onNotesChange}
          fetchResources={fetchResources}
        />
      )}
    </div>
  )
}

export default TechnologyList

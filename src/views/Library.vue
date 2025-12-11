<template>
  <div class="library-view">
    <h2>Библиотека палитр</h2>
    
    <div class="library-controls">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Поиск по названию или тегам..."
        class="search-input"
      />
      <button @click="showSaveDialog = true" class="save-btn">
        Сохранить текущую палитру
      </button>
    </div>

    <div class="palettes-grid">
      <div 
        v-for="palette in filteredPalettes" 
        :key="palette.id"
        class="palette-item"
      >
        <div class="palette-colors">
          <div 
            v-for="(color, index) in palette.colors" 
            :key="index"
            class="mini-color"
            :style="{ backgroundColor: color }"
            :title="color"
          ></div>
        </div>
        <div class="palette-info">
          <h3>{{ palette.name }}</h3>
          <p class="palette-tags">{{ palette.tags.join(', ') }}</p>
          <div class="palette-actions">
            <button @click="loadPalette(palette)" class="action-btn">Загрузить</button>
            <button @click="editPalette(palette)" class="action-btn">Редактировать</button>
            <button @click="deletePalette(palette.id)" class="action-btn delete">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Диалог сохранения -->
    <div v-if="showSaveDialog" class="modal-overlay" @click.self="showSaveDialog = false">
      <div class="modal">
        <h3>Сохранить палитру</h3>
        <input 
          v-model="newPaletteName" 
          type="text" 
          placeholder="Название палитры"
          class="modal-input"
        />
        <input 
          v-model="newPaletteTags" 
          type="text" 
          placeholder="Теги (через запятую)"
          class="modal-input"
        />
        <div class="modal-actions">
          <button @click="savePalette" class="modal-btn primary">Сохранить</button>
          <button @click="showSaveDialog = false" class="modal-btn">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentColors = inject('currentColors', ref([]))
const updateColors = inject('updateColors', null)
const searchQuery = ref('')
const showSaveDialog = ref(false)
const newPaletteName = ref('')
const newPaletteTags = ref('')
const palettes = ref([])
const editingPaletteId = ref(null)

const filteredPalettes = computed(() => {
  if (!searchQuery.value) return palettes.value
  const query = searchQuery.value.toLowerCase()
  return palettes.value.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.tags.some(tag => tag.toLowerCase().includes(query))
  )
})

function loadPalettes() {
  const saved = localStorage.getItem('paletteLibrary')
  if (saved) {
    try {
      palettes.value = JSON.parse(saved)
    } catch (err) {
      console.error('Ошибка загрузки библиотеки:', err)
    }
  }
}

function savePalette() {
  if (!newPaletteName.value.trim() || currentColors.value.length === 0) return
  
  const tags = newPaletteTags.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t)
  
  const palette = {
    id: editingPaletteId.value || Date.now(),
    name: newPaletteName.value,
    colors: [...currentColors.value],
    tags: tags.length > 0 ? tags : ['без тегов'],
    createdAt: new Date().toISOString()
  }
  
  const existingIndex = palettes.value.findIndex(p => p.id === editingPaletteId.value)
  if (existingIndex !== -1) {
    palettes.value.splice(existingIndex, 1, palette)
  } else {
    palettes.value.push(palette)
  }
  localStorage.setItem('paletteLibrary', JSON.stringify(palettes.value))
  
  showSaveDialog.value = false
  newPaletteName.value = ''
  newPaletteTags.value = ''
  editingPaletteId.value = null
}

function loadPalette(palette) {
  currentColors.value = [...palette.colors]
  if (updateColors) {
    updateColors([...palette.colors])
  }
  router.push('/')
}

function editPalette(palette) {
  newPaletteName.value = palette.name
  newPaletteTags.value = palette.tags.join(', ')
  editingPaletteId.value = palette.id
  showSaveDialog.value = true
}

function deletePalette(id) {
  palettes.value = palettes.value.filter(p => p.id !== id)
  localStorage.setItem('paletteLibrary', JSON.stringify(palettes.value))
}

onMounted(() => {
  loadPalettes()
})
</script>

<style scoped>
.library-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.library-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.save-btn {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #5568d3;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.palette-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.palette-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.palette-colors {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  height: 60px;
}

.mini-color {
  flex: 1;
  border-radius: 6px;
  cursor: pointer;
}

.palette-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.palette-tags {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.palette-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.action-btn.delete:hover {
  border-color: #e74c3c;
  color: #e74c3c;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  min-width: 400px;
  max-width: 90%;
}

.modal h3 {
  margin: 0 0 1.5rem 0;
}

.modal-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.modal-btn.primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.modal-btn.primary:hover {
  background: #5568d3;
}
</style>


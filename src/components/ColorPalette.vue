<template>
  <div class="color-palette">
    <div class="controls">
      <div class="generation-section">
        <h3>Генерация палитры</h3>
        <div class="generation-controls">
          <div class="control-group">
            <label>Тип палитры:</label>
            <select v-model="paletteType" class="control-select">
              <option value="random">Случайная</option>
              <option value="analogous">Аналогичная</option>
              <option value="monochrome">Монохромная</option>
              <option value="triad">Триада</option>
              <option value="complementary">Комплементарная</option>
              <option value="mood">По настроению</option>
            </select>
          </div>

          <div v-if="paletteType === 'mood'" class="control-group">
            <label>Настроение:</label>
            <select v-model="moodType" class="control-select">
              <option value="calm">Спокойное</option>
              <option value="energetic">Энергичное</option>
              <option value="professional">Профессиональное</option>
              <option value="natural">Природное</option>
              <option value="warm">Тёплое</option>
              <option value="cool">Холодное</option>
            </select>
          </div>

          <div v-if="paletteType !== 'random' && paletteType !== 'mood'" class="control-group">
            <label>Базовый цвет:</label>
            <input 
              v-model="baseColor" 
              type="color" 
              class="color-picker"
            />
          </div>

          <div class="control-group">
            <label>Количество цветов:</label>
            <select v-model.number="colorCount" class="control-select">
              <option :value="3">3</option>
              <option :value="5">5</option>
              <option :value="7">7</option>
            </select>
          </div>

          <button @click="generatePalette" class="generate-btn">
            Сгенерировать
          </button>
        </div>
      </div>
      
      <div class="settings">
        <label class="format-toggle">
          Формат:
          <button 
            @click="colorFormat = colorFormat === 'hex' ? 'rgb' : 'hex'"
            class="toggle-btn"
            :class="{ active: colorFormat === 'hex' }"
          >
            {{ colorFormat === 'hex' ? 'HEX' : 'RGB' }}
          </button>
        </label>
      </div>
    </div>

    <div class="palette-container">
      <div 
        v-for="(color, index) in colors" 
        :key="index"
        class="color-card"
        :style="{ backgroundColor: color }"
        @click="copyToClipboard(color)"
      >
        <div class="color-info">
          <span class="color-value">{{ formatColor(color) }}</span>
          <button 
            @click.stop="toggleLock(index)"
            class="lock-btn"
            :class="{ locked: lockedIndices.includes(index) }"
            :title="lockedIndices.includes(index) ? 'Открепить цвет' : 'Закрепить цвет'"
          >
            📌
          </button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showNotification" class="notification">
        Скопировано в буфер обмена!
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue'
import * as colorUtils from '../utils/colorUtils'

const colors = inject('currentColors', ref([]))
const colorCount = ref(5)
const colorFormat = ref('hex')
const lockedIndices = ref([])
const showNotification = ref(false)
const paletteType = ref('random')
const moodType = ref('calm')
const baseColor = ref('#667eea')

// Генерация случайного цвета в формате HEX
function generateRandomColor() {
  const h = Math.floor(Math.random() * 360)
  const s = Math.floor(Math.random() * 50) + 50 // 50-100%
  const l = Math.floor(Math.random() * 40) + 30 // 30-70%
  return colorUtils.hslToHex(h, s, l)
}

// Генерация палитры
function generatePalette() {
  let newColors = []
  
  // Генерируем палитру в зависимости от типа
  switch (paletteType.value) {
    case 'analogous':
      newColors = colorUtils.generateAnalogous(baseColor.value, colorCount.value)
      break
    case 'monochrome':
      newColors = colorUtils.generateMonochrome(baseColor.value, colorCount.value)
      break
    case 'triad':
      newColors = colorUtils.generateTriad(baseColor.value, colorCount.value)
      break
    case 'complementary':
      newColors = colorUtils.generateComplementary(baseColor.value, colorCount.value)
      break
    case 'mood':
      newColors = colorUtils.generateByMood(moodType.value, colorCount.value)
      break
    default: // random
      for (let i = 0; i < colorCount.value; i++) {
        newColors.push(generateRandomColor())
      }
  }
  
  // Сохраняем закреплённые цвета
  for (let i = 0; i < colorCount.value; i++) {
    if (lockedIndices.value.includes(i) && colors.value[i]) {
      newColors[i] = colors.value[i]
    }
  }
  
  colors.value = newColors
  // Обновляем индексы закреплённых цветов
  lockedIndices.value = lockedIndices.value.filter(i => i < colorCount.value)
}

// Копирование в буфер обмена
async function copyToClipboard(color) {
  const text = formatColor(color)
  try {
    await navigator.clipboard.writeText(text)
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 2000)
  } catch (err) {
    console.error('Ошибка копирования:', err)
  }
}

// Переключение закрепления цвета
function toggleLock(index) {
  const idx = lockedIndices.value.indexOf(index)
  if (idx > -1) {
    lockedIndices.value.splice(idx, 1)
  } else {
    lockedIndices.value.push(index)
  }
}

// Форматирование цвета для отображения
function formatColor(hex) {
  if (colorFormat.value === 'rgb') {
    return hexToRgb(hex)
  }
  return hex
}

// Преобразование HEX в RGB
function hexToRgb(hex) {
  const rgb = colorUtils.hexToRgb(hex)
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

// Сохранение в localStorage
function saveToLocalStorage() {
  const data = {
    colors: colors.value,
    colorCount: colorCount.value,
    colorFormat: colorFormat.value,
    lockedIndices: lockedIndices.value
  }
  localStorage.setItem('colorPalette', JSON.stringify(data))
}

// Загрузка из localStorage
function loadFromLocalStorage() {
  if (colors.value.length > 0) return

  const saved = localStorage.getItem('colorPalette')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      colors.value = data.colors || []
      colorCount.value = data.colorCount || 5
      colorFormat.value = data.colorFormat || 'hex'
      lockedIndices.value = data.lockedIndices || []
    } catch (err) {
      console.error('Ошибка загрузки из localStorage:', err)
    }
  }
  
  // Если нет сохранённых данных, генерируем новую палитру
  if (colors.value.length === 0) {
    generatePalette()
  }
}

// Автоматическое сохранение при изменениях
watch([colors, colorCount, colorFormat, lockedIndices], () => {
  if (colors.value.length > 0) {
    saveToLocalStorage()
  }
}, { deep: true })

watch(colors, (newColors) => {
  if (Array.isArray(newColors) && newColors.length > 0) {
    colorCount.value = newColors.length
    lockedIndices.value = lockedIndices.value.filter(i => i < newColors.length)
  }
}, { deep: true })

onMounted(() => {
  loadFromLocalStorage()
})
</script>

<style scoped>
.color-palette {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.generation-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.generation-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.generation-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 500;
  font-size: 0.9rem;
  color: #666;
}

.control-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.control-select:hover {
  border-color: #667eea;
}

.color-picker {
  width: 60px;
  height: 40px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
}

.generate-btn {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.generate-btn:active {
  transform: translateY(0);
}

.settings {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.settings label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.settings select {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.settings select:hover {
  border-color: #667eea;
}

.format-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-btn {
  padding: 0.5rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.palette-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.color-card {
  flex: 1;
  min-width: 150px;
  min-height: 200px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-value {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  font-size: 0.9rem;
}

.lock-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.6;
  transition: opacity 0.2s, transform 0.2s;
}

.lock-btn:hover {
  opacity: 1;
  transform: scale(1.2);
}

.lock-btn.locked {
  opacity: 1;
  transform: scale(1.1);
}

.notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #4caf50;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .color-palette {
    padding: 1rem;
  }
  
  .palette-container {
    flex-direction: column;
  }
  
  .color-card {
    min-width: 100%;
  }
  
  .settings {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

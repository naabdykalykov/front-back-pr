<template>
  <div class="color-preview" :class="{ 'dark-bg': isDarkBackground }">
    <div class="preview-controls">
      <label class="background-toggle">
        Фон:
        <button 
          @click="isDarkBackground = !isDarkBackground"
          class="toggle-btn"
        >
          {{ isDarkBackground ? 'Тёмный' : 'Светлый' }}
        </button>
      </label>
    </div>

    <div class="preview-content">
      <div class="preview-section">
        <h2 class="preview-title" :style="{ color: getColor(0) }">
          Заголовок примера
        </h2>
        <p class="preview-text">
          Это пример текста, который демонстрирует использование цветов из палитры.
        </p>
      </div>

      <div class="preview-section">
        <div class="buttons-group">
          <button 
            class="preview-button primary"
            :style="{ 
              backgroundColor: getColor(1) || '#667eea',
              color: getTextColor(getColor(1) || '#667eea')
            }"
          >
            Основная кнопка
          </button>
          <button 
            class="preview-button secondary"
            :style="{ 
              borderColor: getColor(1) || '#667eea',
              color: getColor(1) || '#667eea'
            }"
          >
            Вторичная кнопка
          </button>
        </div>
      </div>

      <div class="preview-section">
        <div 
          class="preview-card"
          :style="{ 
            backgroundColor: getColor(2) || '#f0f0f0',
            color: getTextColor(getColor(2) || '#f0f0f0')
          }"
        >
          <h3 class="card-title">Карточка</h3>
          <p class="card-text">
            Это пример карточки с применением цвета из палитры.
          </p>
        </div>
      </div>

      <div class="preview-section">
        <div class="badges-group">
          <span 
            class="preview-badge"
            :style="{ 
              backgroundColor: getColor(3) || '#4caf50',
              color: getTextColor(getColor(3) || '#4caf50')
            }"
          >
            Бейдж
          </span>
          <span 
            class="preview-badge"
            :style="{ 
              backgroundColor: getColor(4) || '#ff9800',
              color: getTextColor(getColor(4) || '#ff9800')
            }"
          >
            Тег
          </span>
        </div>
      </div>

      <div class="preview-section">
        <div 
          class="preview-alert"
          :style="{ 
            backgroundColor: getColor(3) || '#fff3cd',
            color: getTextColor(getColor(3) || '#fff3cd'),
            borderLeftColor: getColor(1) || '#667eea'
          }"
        >
          <strong>Уведомление:</strong> Это пример уведомления с использованием цветов палитры.
        </div>
      </div>

      <div class="preview-section">
        <div class="progress-group">
          <div class="progress-bar-container">
            <div 
              class="progress-bar"
              :style="{ 
                backgroundColor: getColor(1) || '#667eea',
                width: '75%'
              }"
            ></div>
          </div>
        </div>
      </div>

      <div class="preview-section">
        <div class="tabs-group">
          <button 
            class="tab-button active"
            :style="{ 
              borderBottomColor: getColor(1) || '#667eea',
              color: getColor(1) || '#667eea'
            }"
          >
            Вкладка 1
          </button>
          <button class="tab-button">Вкладка 2</button>
          <button class="tab-button">Вкладка 3</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  colors: {
    type: Array,
    default: () => []
  }
})

const isDarkBackground = ref(false)

function getColor(index) {
  return props.colors[index] || null
}

// Определение цвета текста в зависимости от яркости фона
function getTextColor(hex) {
  if (!hex) return '#000'
  
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  
  // Вычисление яркости (luminance)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#000000' : '#ffffff'
}
</script>

<style scoped>
.color-preview {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  transition: background-color 0.3s;
}

.color-preview.dark-bg {
  background: #1a1a1a;
}

.preview-controls {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.dark-bg .preview-controls {
  border-bottom-color: #333;
}

.background-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
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

.dark-bg .toggle-btn {
  background: #333;
  border-color: #555;
  color: white;
}

.toggle-btn:hover {
  border-color: #667eea;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.preview-section {
  padding: 1.5rem;
}

.preview-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  transition: color 0.3s;
}

.preview-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
}

.dark-bg .preview-text {
  color: #aaa;
}

.preview-button {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.preview-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.preview-button:active {
  transform: translateY(0);
}

.preview-card {
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.preview-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card-text {
  font-size: 1rem;
  line-height: 1.6;
}

.buttons-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.preview-button.primary {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.preview-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.preview-button.secondary {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: transparent;
  border: 2px solid;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-button.secondary:hover {
  background: rgba(0, 0, 0, 0.05);
}

.badges-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.preview-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.preview-alert {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border-left: 4px solid;
  font-weight: 500;
}

.progress-group {
  width: 100%;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.dark-bg .progress-bar-container {
  background: #333;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.tabs-group {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e0e0e0;
}

.dark-bg .tabs-group {
  border-bottom-color: #333;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.dark-bg .tab-button {
  color: #aaa;
}

.tab-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dark-bg .tab-button:hover {
  background: rgba(255, 255, 255, 0.05);
}

.tab-button.active {
  font-weight: 600;
}

@media (max-width: 768px) {
  .color-preview {
    padding: 1rem;
  }
  
  .preview-title {
    font-size: 1.5rem;
  }
}
</style>

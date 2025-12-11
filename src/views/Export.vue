<template>
  <div class="export-view">
    <h2>Экспорт палитры</h2>
    
    <div v-if="colors.length === 0" class="empty-state">
      <p>Загрузите палитру на главной странице для экспорта</p>
      <router-link to="/" class="link-btn">Перейти к генератору</router-link>
    </div>

    <div v-else>
      <div class="export-section">
        <h3>Выберите формат экспорта</h3>
        <div class="format-tabs">
          <button 
            v-for="format in formats" 
            :key="format.id"
            @click="selectedFormat = format.id"
            class="format-tab"
            :class="{ active: selectedFormat === format.id }"
          >
            {{ format.name }}
          </button>
        </div>

        <div class="export-preview">
          <div class="preview-header">
            <h4>{{ formats.find(f => f.id === selectedFormat)?.name }}</h4>
            <button @click="copyCode" class="copy-btn">Копировать</button>
          </div>
          <pre class="code-block"><code>{{ exportCode }}</code></pre>
        </div>
      </div>

      <div class="export-section">
        <h3>Превью UI-компонентов</h3>
        <div class="ui-preview">
          <div class="ui-component">
            <button 
              class="preview-button"
              :style="{ backgroundColor: colors[0] || '#667eea', color: getTextColor(colors[0] || '#667eea') }"
            >
              Кнопка
            </button>
          </div>
          <div class="ui-component">
            <div 
              class="preview-card"
              :style="{ backgroundColor: colors[1] || '#f0f0f0', color: getTextColor(colors[1] || '#f0f0f0') }"
            >
              <h4>Карточка</h4>
              <p>Пример карточки с цветом из палитры</p>
            </div>
          </div>
          <div class="ui-component">
            <div 
              class="preview-badge"
              :style="{ backgroundColor: colors[2] || '#4caf50', color: getTextColor(colors[2] || '#4caf50') }"
            >
              Бейдж
            </div>
          </div>
          <div class="ui-component">
            <div 
              class="preview-alert"
              :style="{ backgroundColor: colors[3] || '#fff3cd', color: getTextColor(colors[3] || '#fff3cd') }"
            >
              Уведомление
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import * as colorUtils from '../utils/colorUtils'

const colors = inject('currentColors', ref([]))
const selectedFormat = ref('css')

const formats = [
  { id: 'css', name: 'CSS Variables' },
  { id: 'scss', name: 'SCSS Variables' },
  { id: 'tailwind', name: 'Tailwind Config' },
  { id: 'json', name: 'JSON' }
]

const exportCode = computed(() => {
  switch (selectedFormat.value) {
    case 'css':
      return generateCSSVariables()
    case 'scss':
      return generateSCSSVariables()
    case 'tailwind':
      return generateTailwindConfig()
    case 'json':
      return generateJSON()
    default:
      return ''
  }
})

function generateCSSVariables() {
  let code = ':root {\n'
  colors.value.forEach((color, index) => {
    code += `  --color-${index + 1}: ${color};\n`
  })
  code += '}'
  return code
}

function generateSCSSVariables() {
  let code = '$colors: (\n'
  colors.value.forEach((color, index) => {
    code += `  ${index + 1}: ${color}${index < colors.value.length - 1 ? ',' : ''}\n`
  })
  code += ');\n\n'
  colors.value.forEach((color, index) => {
    code += `$color-${index + 1}: ${color};\n`
  })
  return code
}

function generateTailwindConfig() {
  let code = 'module.exports = {\n'
  code += '  theme: {\n'
  code += '    extend: {\n'
  code += '      colors: {\n'
  colors.value.forEach((color, index) => {
    code += `        'palette-${index + 1}': '${color}'${index < colors.value.length - 1 ? ',' : ''}\n`
  })
  code += '      }\n'
  code += '    }\n'
  code += '  }\n'
  code += '}'
  return code
}

function generateJSON() {
  return JSON.stringify({
    palette: colors.value,
    generated: new Date().toISOString()
  }, null, 2)
}

function getTextColor(hex) {
  if (!hex) return '#000'
  const luminance = colorUtils.getLuminance(hex)
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(exportCode.value)
    alert('Код скопирован в буфер обмена!')
  } catch (err) {
    console.error('Ошибка копирования:', err)
  }
}
</script>

<style scoped>
.export-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.link-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}

.export-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.export-section h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.format-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.format-tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.format-tab:hover {
  border-color: #667eea;
}

.format-tab.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.export-preview {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
}

.preview-header h4 {
  margin: 0;
}

.copy-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.copy-btn:hover {
  background: #5568d3;
}

.code-block {
  margin: 0;
  padding: 1.5rem;
  background: #1e1e1e;
  color: #d4d4d4;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.ui-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.ui-component {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.preview-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.preview-card {
  padding: 1.5rem;
  border-radius: 8px;
}

.preview-card h4 {
  margin: 0 0 0.5rem 0;
}

.preview-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.preview-alert {
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
}
</style>



<template>
  <div class="analysis-view">
    <h2>Анализ доступности и контрастности</h2>
    
    <div v-if="colors.length === 0" class="empty-state">
      <p>Загрузите палитру на главной странице для анализа</p>
      <router-link to="/" class="link-btn">Перейти к генератору</router-link>
    </div>

    <div v-else>
      <div class="analysis-section">
        <h3>Контрастность цветов</h3>
        <div class="contrast-grid">
          <div 
            v-for="(color1, i) in colors" 
            :key="i"
            class="contrast-row"
          >
            <div 
              v-for="(color2, j) in colors" 
              :key="j"
              class="contrast-cell"
              :class="getContrastClass(i, j)"
            >
              <div 
                class="contrast-preview"
                :style="{ 
                  backgroundColor: color1, 
                  color: color2 
                }"
              >
                <span class="contrast-text">Aa</span>
              </div>
              <div class="contrast-info">
                <div class="contrast-ratio">{{ getContrastRatio(i, j).toFixed(2) }}</div>
                <div class="contrast-level">{{ getContrastLevel(i, j) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="analysis-section">
        <h3>Рекомендации по доступности</h3>
        <div class="recommendations">
          <div 
            v-for="(rec, index) in recommendations" 
            :key="index"
            class="recommendation-item"
          >
            <span class="rec-icon">{{ rec.icon }}</span>
            <span class="rec-text">{{ rec.text }}</span>
          </div>
        </div>
      </div>

      <div class="analysis-section">
        <h3>Цветовой круг</h3>
        <div class="color-wheel-container">
          <canvas ref="colorWheelCanvas" class="color-wheel"></canvas>
          <div class="color-points">
            <div 
              v-for="(color, index) in colors" 
              :key="index"
              class="color-point"
              :style="getColorPointStyle(color)"
              :title="color"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import * as colorUtils from '../utils/colorUtils'

const colors = inject('currentColors', ref([]))
const colorWheelCanvas = ref(null)

const recommendations = computed(() => {
  const recs = []
  let hasLowContrast = false
  
  for (let i = 0; i < colors.value.length; i++) {
    for (let j = i + 1; j < colors.value.length; j++) {
      const contrast = colorUtils.getContrast(colors.value[i], colors.value[j])
      const level = colorUtils.getAccessibilityLevel(contrast)
      
      if (level.level === 'FAIL') {
        hasLowContrast = true
        recs.push({
          icon: '⚠️',
          text: `Цвета ${colors.value[i]} и ${colors.value[j]} имеют недостаточный контраст (${contrast.toFixed(2)}:1)`
        })
      } else if (!level.normal) {
        recs.push({
          icon: 'ℹ️',
          text: `Цвета ${colors.value[i]} и ${colors.value[j]} подходят только для крупного текста (AA Large)`
        })
      }
    }
  }
  
  if (!hasLowContrast && recs.length === 0) {
    recs.push({
      icon: '✅',
      text: 'Все комбинации цветов соответствуют стандартам доступности WCAG'
    })
  }
  
  return recs
})

function getContrastRatio(i, j) {
  if (i === j) return 1
  return colorUtils.getContrast(colors.value[i], colors.value[j])
}

function getContrastLevel(i, j) {
  if (i === j) return '-'
  const contrast = getContrastRatio(i, j)
  const level = colorUtils.getAccessibilityLevel(contrast)
  return level.level
}

function getContrastClass(i, j) {
  if (i === j) return 'same-color'
  const contrast = getContrastRatio(i, j)
  const level = colorUtils.getAccessibilityLevel(contrast)
  return `level-${level.level.toLowerCase()}`
}

function getColorPointStyle(color) {
  const hsl = colorUtils.hexToHsl(color)
  const angle = (hsl.h * Math.PI) / 180
  const radius = 120
  const x = 150 + Math.cos(angle) * radius * (hsl.s / 100)
  const y = 150 + Math.sin(angle) * radius * (hsl.s / 100)
  return {
    left: `${x}px`,
    top: `${y}px`,
    backgroundColor: color
  }
}

function drawColorWheel() {
  if (!colorWheelCanvas.value) return
  
  const canvas = colorWheelCanvas.value
  canvas.width = 300
  canvas.height = 300
  const ctx = canvas.getContext('2d')
  const centerX = 150
  const centerY = 150
  const radius = 120
  
  // Рисуем цветовой круг
  const imageData = ctx.createImageData(300, 300)
  const data = imageData.data
  
  for (let y = 0; y < 300; y++) {
    for (let x = 0; x < 300; x++) {
      const dx = x - centerX
      const dy = y - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance <= radius) {
        const angle = Math.atan2(dy, dx) * 180 / Math.PI + 180
        const hue = angle
        const saturation = (distance / radius) * 100
        const lightness = 50
        const color = colorUtils.hslToHex(hue, saturation, lightness)
        const rgb = colorUtils.hexToRgb(color)
        
        const index = (y * 300 + x) * 4
        data[index] = rgb.r
        data[index + 1] = rgb.g
        data[index + 2] = rgb.b
        data[index + 3] = 255
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
}

onMounted(() => {
  drawColorWheel()
})

watch(colors, () => {
  drawColorWheel()
}, { deep: true })
</script>

<style scoped>
.analysis-view {
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

.analysis-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.analysis-section h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.contrast-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contrast-row {
  display: flex;
  gap: 0.5rem;
}

.contrast-cell {
  flex: 1;
  min-width: 100px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.5rem;
}

.contrast-preview {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.contrast-text {
  font-size: 1.5rem;
  font-weight: bold;
}

.contrast-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.contrast-ratio {
  font-weight: 600;
}

.contrast-level {
  color: #666;
}

.level-aaa {
  border-color: #4caf50;
  background: #f1f8f4;
}

.level-aa {
  border-color: #ff9800;
  background: #fff8f0;
}

.level-fail {
  border-color: #e74c3c;
  background: #fef0f0;
}

.same-color {
  opacity: 0.5;
}

.recommendations {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.rec-icon {
  font-size: 1.5rem;
}

.color-wheel-container {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

.color-wheel {
  width: 300px;
  height: 300px;
  border-radius: 50%;
}

.color-points {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.color-point {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  cursor: pointer;
}
</style>


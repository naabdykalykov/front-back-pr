// Утилиты для работы с цветами

// Преобразование HEX в RGB
export function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

// Преобразование RGB в HEX
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('').toUpperCase()
}

// Преобразование HEX в HSL
export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHsl(r, g, b)
}

// Преобразование RGB в HSL
export function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

// Преобразование HSL в HEX
export function hslToHex(h, s, l) {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
}

// Вычисление относительной яркости (luminance) для WCAG
export function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  const [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Вычисление контрастности между двумя цветами
export function getContrast(color1, color2) {
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

// Проверка уровня доступности WCAG
export function getAccessibilityLevel(contrast) {
  if (contrast >= 7) return { level: 'AAA', large: true, normal: true }
  if (contrast >= 4.5) return { level: 'AA', large: true, normal: true }
  if (contrast >= 3) return { level: 'AA', large: true, normal: false }
  return { level: 'FAIL', large: false, normal: false }
}

// Генерация аналогичной палитры (соседние цвета на цветовом круге)
export function generateAnalogous(baseColor, count = 5) {
  const baseHsl = hexToHsl(baseColor)
  const colors = []
  const step = 30 // шаг в градусах
  
  for (let i = 0; i < count; i++) {
    const h = (baseHsl.h + (i - Math.floor(count / 2)) * step + 360) % 360
    const s = baseHsl.s + (Math.random() * 20 - 10) // небольшая вариация
    const l = baseHsl.l + (Math.random() * 20 - 10)
    colors.push(hslToHex(
      h,
      Math.max(30, Math.min(100, s)),
      Math.max(20, Math.min(80, l))
    ))
  }
  return colors
}

// Генерация монохромной палитры
export function generateMonochrome(baseColor, count = 5) {
  const baseHsl = hexToHsl(baseColor)
  const colors = []
  const lightnessStep = 80 / (count - 1)
  
  for (let i = 0; i < count; i++) {
    const l = 10 + i * lightnessStep
    colors.push(hslToHex(
      baseHsl.h,
      baseHsl.s,
      l
    ))
  }
  return colors
}

// Генерация триады (3 цвета, равномерно распределённые)
export function generateTriad(baseColor, count = 5) {
  const baseHsl = hexToHsl(baseColor)
  const colors = [baseColor]
  const hueStep = 120
  
  // Генерируем основные цвета триады
  const hues = [
    baseHsl.h,
    (baseHsl.h + hueStep) % 360,
    (baseHsl.h + hueStep * 2) % 360
  ]
  
  // Заполняем остальные цвета вариациями
  for (let i = 1; i < count; i++) {
    const hueIndex = i % 3
    const variation = Math.floor(i / 3)
    const h = hues[hueIndex]
    const s = baseHsl.s + (variation % 2 === 0 ? -15 : 15)
    const l = baseHsl.l + (variation % 2 === 0 ? 10 : -10)
    colors.push(hslToHex(
      h,
      Math.max(30, Math.min(100, s)),
      Math.max(20, Math.min(80, l))
    ))
  }
  return colors
}

// Генерация комплементарной палитры
export function generateComplementary(baseColor, count = 5) {
  const baseHsl = hexToHsl(baseColor)
  const colors = [baseColor]
  const complementaryHue = (baseHsl.h + 180) % 360
  
  // Чередуем основной и комплементарный цвета
  for (let i = 1; i < count; i++) {
    const useComplementary = i % 2 === 1
    const h = useComplementary ? complementaryHue : baseHsl.h
    const s = baseHsl.s + (Math.random() * 20 - 10)
    const l = baseHsl.l + (Math.random() * 20 - 10)
    colors.push(hslToHex(
      h,
      Math.max(30, Math.min(100, s)),
      Math.max(20, Math.min(80, l))
    ))
  }
  return colors
}

// Генерация палитры по настроению
export function generateByMood(mood, count = 5) {
  const moods = {
    calm: { h: [180, 240], s: [30, 60], l: [40, 70] }, // Синие, спокойные
    energetic: { h: [0, 60], s: [70, 100], l: [40, 60] }, // Красные, оранжевые
    professional: { h: [200, 280], s: [20, 50], l: [30, 60] }, // Синие, фиолетовые
    natural: { h: [60, 150], s: [40, 80], l: [30, 70] }, // Зелёные
    warm: { h: [15, 45], s: [50, 90], l: [45, 75] }, // Тёплые
    cool: { h: [180, 270], s: [40, 80], l: [35, 65] } // Холодные
  }
  
  const moodConfig = moods[mood] || moods.calm
  const colors = []
  
  for (let i = 0; i < count; i++) {
    const h = moodConfig.h[0] + Math.random() * (moodConfig.h[1] - moodConfig.h[0])
    const s = moodConfig.s[0] + Math.random() * (moodConfig.s[1] - moodConfig.s[0])
    const l = moodConfig.l[0] + Math.random() * (moodConfig.l[1] - moodConfig.l[0])
    colors.push(hslToHex(h, s, l))
  }
  
  return colors
}



<script setup>
import { provide, ref } from 'vue'
import { RouterView } from 'vue-router'

const paletteColors = ref([])
const currentColors = ref([])

function updateColors(colors) {
  paletteColors.value = colors
  currentColors.value = colors
}

provide('updateColors', updateColors)
provide('currentColors', currentColors)
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Генератор цветовых палитр</h1>
      <p class="subtitle">Создавайте и управляйте гармоничными цветовыми схемами</p>
      <nav class="main-nav">
        <router-link to="/" class="nav-link">Генератор</router-link>
        <router-link to="/analysis" class="nav-link">Анализ</router-link>
        <router-link to="/library" class="nav-link">Библиотека</router-link>
        <router-link to="/export" class="nav-link">Экспорт</router-link>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.app-header {
  text-align: center;
  padding: 3rem 2rem 2rem;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  font-weight: 400;
}

.main-nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.nav-link {
  padding: 0.5rem 1.5rem;
  text-decoration: none;
  color: #666;
  border-radius: 6px;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-link:hover {
  background: #f0f0f0;
  color: #667eea;
}

.nav-link.router-link-active {
  background: #667eea;
  color: white;
}

.app-main {
  padding: 0 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 768px) {
  .app-header {
    padding: 2rem 1rem 1.5rem;
  }
  
  .app-header h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style>

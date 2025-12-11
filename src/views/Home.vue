<template>
  <div class="home-view">
    <ColorPalette />
    <ColorPreview :colors="colors" />
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import ColorPalette from '../components/ColorPalette.vue'
import ColorPreview from '../components/ColorPreview.vue'

const colors = inject('currentColors', ref([]))
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>


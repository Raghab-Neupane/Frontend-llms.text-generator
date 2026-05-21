<script setup>
import './action-card.css'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  iconBg: {
    type: String,
    default: '#f5f5f5'
  },
  iconColor: {
    type: String,
    default: '#333333'
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>

<template>
  <div class="action-card" @click="handleClick" role="button" tabindex="0">
    <!-- Icon -->
    <div class="action-card__icon" :style="{ background: iconBg }">
      <slot name="icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5" :style="{ color: iconColor }"/>
        </svg>
      </slot>
    </div>

    <!-- Text -->
    <div class="action-card__text">
      <p class="action-card__title">{{ title }}</p>
      <p v-if="description" class="action-card__description">{{ description }}</p>
    </div>

    <!-- Arrow -->
    <div class="action-card__arrow">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>

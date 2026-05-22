<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ActionCard from '../component/action-card.vue'
import SideMenu from '../component/side-menu.vue'

const router = useRouter()
const isMenuOpen = ref(false)

function goToPrevious() {
  isMenuOpen.value = true
}

function goToNew() {
  router.push('/generator/new')
}
</script>

<template>
  <section class="generator-page">
    <!-- Header -->
    <header class="generator-header">
      <h1 class="generator-title">
        LLMS.txt <span class="generator-title-accent">generator</span>
      </h1>
      <p class="generator-subtitle">Generate text using LLMs</p>
    </header>

    <!-- Decorative Divider -->
    <div class="generator-divider">
      <div class="divider-line"></div>
    </div>

    <!-- Action Cards -->
    <div class="generator-cards">
      <ActionCard
        title="View my previous llms.txt"
        description="Browse and manage your previously generated llms.txt files."
        icon-bg="#f0f0f0"
        icon-color="#333333"
        @click="goToPrevious"
      >
        <template #icon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
            <polyline points="10,9 9,9 8,9" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
      </ActionCard>

      <ActionCard
        title="Start a new one"
        description="Generate a fresh llms.txt file from any website URL."
        icon-bg="#111111"
        icon-color="#ffffff"
        @click="goToNew"
      >
        <template #icon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="1.5"/>
            <line x1="12" y1="8" x2="12" y2="16" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="8" y1="12" x2="16" y2="12" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </template>
      </ActionCard>
    </div>

    <!-- Footer hint -->
    <p class="generator-hint">Choose an option above to get started.</p>

    <!-- Slide-in History Menu -->
    <SideMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
  </section>
</template>

<style scoped>
/* ===== Page ===== */
.generator-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  padding: 48px 24px;
}

/* ===== Header ===== */
.generator-header {
  text-align: center;
  margin-bottom: 12px;
}

.generator-title {
  font-size: 2.6rem;
  font-weight: 300;
  color: #111111;
  letter-spacing: -0.5px;
  margin: 0 0 6px 0;
}

.generator-title-accent {
  font-weight: 700;
  font-style: italic;
}

.generator-subtitle {
  font-size: 0.95rem;
  font-style: italic;
  color: #888888;
  margin: 0;
}

/* ===== Divider ===== */
.generator-divider {
  width: 100%;
  max-width: 460px;
  padding: 20px 0 32px;
}

.divider-line {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #d5d5d5 30%,
    #d5d5d5 70%,
    transparent 100%
  );
}

/* ===== Cards Container ===== */
.generator-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 460px;
}

/* ===== Hint ===== */
.generator-hint {
  margin-top: 28px;
  font-size: 0.85rem;
  color: #bbbbbb;
  text-align: center;
}

/* ===== Responsive ===== */
@media (max-width: 600px) {
  .generator-page {
    padding: 36px 16px;
  }

  .generator-title {
    font-size: 2rem;
  }

  .generator-cards {
    max-width: 100%;
  }
}
</style>

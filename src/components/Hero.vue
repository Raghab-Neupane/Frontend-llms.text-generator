<script setup>
import { useRouter } from 'vue-router'
import InformationCard from '../component/information-card.vue'
import heroData from '../data/hero.json'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <section id="main-page" class="main-page">
    <!-- Top White Section -->
    <div class="hero-section">
      <h1 class="hero-title">
        {{ heroData.title }} <span class="hero-title-bold">{{ heroData.titleAccent }}</span>
      </h1>
      <p class="hero-subtitle">{{ heroData.subtitle }}</p>
    </div>

    <!-- Decorative Stroke Lines -->
    <div class="stroke-lines">
      <div class="stroke-line"></div>
      <div class="stroke-line"></div>
      <div class="stroke-line"></div>
      <div class="stroke-line"></div>
      <div class="stroke-line"></div>
      <div class="stroke-line"></div>
      <div class="stroke-line"></div>
    </div>

    <!-- Info Card Carousel (Component) -->
    <InformationCard :slides="heroData.slides" />

    <!-- Bottom Black Diagonal Section -->
    <div class="bottom-section">
      <div class="diagonal-cut"></div>
      <div class="bottom-content">
        <button class="get-started-btn" @click="goToLogin">{{ heroData.ctaButton }}</button>
        <p class="bottom-text">{{ heroData.ctaDescription }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ===== Reset & Base ===== */
.main-page {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* ===== Hero Section ===== */
.hero-section {
  padding-top: 60px;
  padding-bottom: 20px;
  text-align: center;
  width: 100%;
}

.hero-title {
  font-size: 3rem;
  font-weight: 300;
  color: #111111;
  letter-spacing: -0.5px;
  margin: 0 0 8px 0;
}

.hero-title-bold {
  font-weight: 700;
  font-style: italic;
}

.hero-subtitle {
  font-size: 1rem;
  font-style: italic;
  color: #333333;
  margin: 0;
  font-weight: 400;
}

/* ===== Decorative Stroke Lines ===== */
.stroke-lines {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  position: relative;
  z-index: 1;
}

.stroke-line {
  width: 85%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #d8d8d8 15%,
    #c8c8c8 50%,
    #d8d8d8 85%,
    transparent 100%
  );
  opacity: 0.6;
}

.stroke-line:nth-child(1) { width: 70%; }
.stroke-line:nth-child(2) { width: 78%; }
.stroke-line:nth-child(3) { width: 85%; }
.stroke-line:nth-child(4) { width: 90%; }
.stroke-line:nth-child(5) { width: 85%; }
.stroke-line:nth-child(6) { width: 78%; }
.stroke-line:nth-child(7) { width: 70%; }

/* ===== Bottom Black Section ===== */
.bottom-section {
  width: 100%;
  flex: 1;
  position: relative;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diagonal-cut {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  clip-path: polygon(60% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 40%);
  z-index: 0;
}

.bottom-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding-top: 60px;
}

.get-started-btn {
  background: #ffffff;
  color: #111111;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  padding: 14px 80px;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  letter-spacing: 0.3px;
}

.get-started-btn:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.15);
}

.get-started-btn:active {
  transform: translateY(0);
}

.bottom-text {
  color: #ffffff;
  font-size: 0.95rem;
  margin-top: 16px;
  font-weight: 400;
}

/* ===== Responsive: Tablet ===== */
@media (max-width: 900px) {
  .hero-section {
    padding-top: 48px;
    padding-bottom: 16px;
  }

  .hero-title {
    font-size: 2.4rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .bottom-section {
    min-height: 240px;
  }

  .bottom-content {
    padding-top: 50px;
  }

  .get-started-btn {
    padding: 12px 60px;
  }

  .diagonal-cut {
    clip-path: polygon(55% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 35%);
  }
}

/* ===== Responsive: Mobile ===== */
@media (max-width: 600px) {
  .hero-section {
    padding-top: 36px;
    padding-bottom: 12px;
  }

  .hero-title {
    font-size: 1.8rem;
    letter-spacing: -0.3px;
  }

  .hero-subtitle {
    font-size: 0.88rem;
  }

  .stroke-lines {
    gap: 10px;
    padding: 8px 0;
  }

  .bottom-section {
    min-height: 220px;
  }

  .bottom-content {
    padding-top: 40px;
  }

  .get-started-btn {
    padding: 12px 44px;
    font-size: 0.92rem;
  }

  .bottom-text {
    font-size: 0.85rem;
    margin-top: 12px;
    padding: 0 16px;
  }

  .diagonal-cut {
    clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 30%);
  }
}

/* ===== Responsive: Very Small ===== */
@media (max-width: 380px) {
  .hero-title {
    font-size: 1.5rem;
  }

  .get-started-btn {
    padding: 10px 32px;
    font-size: 0.88rem;
  }

  .bottom-section {
    min-height: 200px;
  }
}
</style>

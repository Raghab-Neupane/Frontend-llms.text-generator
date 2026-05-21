<script setup>
import { ref, computed } from 'vue'

const currentSlide = ref(0)

const slides = ref([
  {
    question: 'What is llms.txt generator?',
    answer: 'llms.txt is a file that is used to generate text using LLMs.'
  },
  {
    question: 'Why use llms.txt?',
    answer: 'It helps AI models understand your site structure, docs, and content more effectively.'
  },
  {
    question: 'How does it work?',
    answer: 'Enter your site URL and we crawl it to produce a clean, structured llms.txt file automatically.'
  }
])

const totalSlides = computed(() => slides.value.length)

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % totalSlides.value
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + totalSlides.value) % totalSlides.value
}
</script>

<template>
  <section id="main-page" class="main-page">
    <!-- Top White Section -->
    <div class="hero-section">
      <h1 class="hero-title">
        LLMS.txt <span class="hero-title-bold">generator</span>
      </h1>
      <p class="hero-subtitle">Generate text using LLMs</p>
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

    <!-- Info Card Carousel with Navigation Circles -->
    <div class="info-area">
      <button
        class="nav-circle nav-circle-left"
        @click="prevSlide"
        aria-label="Previous slide"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="carousel-wrapper">
        <div
          class="carousel-track"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="info-card"
          >
            <p class="info-question">{{ slide.question }}</p>
            <p class="info-answer">{{ slide.answer }}</p>
          </div>
        </div>

        <!-- Dot indicators -->
        <div class="carousel-dots">
          <button
            v-for="(_, index) in slides"
            :key="index"
            class="dot"
            :class="{ active: currentSlide === index }"
            @click="currentSlide = index"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
      </div>

      <button
        class="nav-circle nav-circle-right"
        @click="nextSlide"
        aria-label="Next slide"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Bottom Black Diagonal Section -->
    <div class="bottom-section">
      <div class="diagonal-cut"></div>
      <div class="bottom-content">
        <button class="get-started-btn">get started</button>
        <p class="bottom-text">Start to generate the llms.txt for your site.</p>
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
  overflow: hidden;
  position: relative;
}

/* ===== Hero Section ===== */
.hero-section {
  padding-top: 60px;
  padding-bottom: 20px;
  text-align: center;
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

/* ===== Info Area (Carousel) ===== */
.info-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 30px 20px 40px;
  position: relative;
  z-index: 2;
}

/* ===== Navigation Circle Buttons ===== */
.nav-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #c0c0c0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  position: relative;
}

.nav-circle:hover {
  background: #888888;
  transform: scale(1.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.nav-circle-left:hover {
  transform: scale(1.15) translateX(-4px);
}

.nav-circle-right:hover {
  transform: scale(1.15) translateX(4px);
}

.nav-circle:active {
  transform: scale(0.95);
  background: #666666;
}

/* ===== Carousel ===== */
.carousel-wrapper {
  width: 340px;
  overflow: hidden;
  position: relative;
}

.carousel-track {
  display: flex;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-card {
  min-width: 100%;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 28px 36px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.info-question {
  font-size: 1rem;
  font-weight: 600;
  color: #111111;
  margin: 0 0 12px 0;
}

.info-answer {
  font-size: 0.92rem;
  font-weight: 400;
  color: #444444;
  margin: 0;
  line-height: 1.65;
}

/* ===== Dot Indicators ===== */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: #d0d0d0;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  outline: none;
}

.dot.active {
  background: #555555;
  transform: scale(1.3);
}

.dot:hover:not(.active) {
  background: #a0a0a0;
  transform: scale(1.15);
}

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

/* ===== Responsive ===== */
@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
  }

  .info-area {
    gap: 16px;
    padding: 20px 12px 30px;
  }

  .carousel-wrapper {
    width: 260px;
  }

  .info-card {
    padding: 20px 20px;
  }

  .nav-circle {
    width: 36px;
    height: 36px;
  }

  .get-started-btn {
    padding: 12px 50px;
  }
}
</style>

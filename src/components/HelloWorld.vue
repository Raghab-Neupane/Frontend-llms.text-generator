<script setup>
import { ref } from 'vue'

const count = ref(0)
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

    <!-- Info Card with Decorative Circles -->
    <div class="info-area">
      <div class="circle circle-left"></div>
      <div class="info-card">
        <p class="info-question">what is llms.txt generator?</p>
        <p class="info-answer">
          llms.txt is a file that is used to<br />
          generate text using LLMs.
        </p>
      </div>
      <div class="circle circle-right"></div>
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

/* ===== Info Area ===== */
.info-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 50px 20px 60px;
  position: relative;
  z-index: 2;
}

.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #c0c0c0;
  flex-shrink: 0;
}

.info-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 28px 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  max-width: 360px;
}

.info-question {
  font-size: 1rem;
  font-weight: 600;
  color: #111111;
  margin: 0 0 12px 0;
}

.info-answer {
  font-size: 0.95rem;
  font-weight: 400;
  color: #333333;
  margin: 0;
  line-height: 1.6;
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
    gap: 20px;
    padding: 30px 15px 40px;
  }

  .info-card {
    padding: 20px 24px;
  }

  .circle {
    width: 30px;
    height: 30px;
  }

  .get-started-btn {
    padding: 12px 50px;
  }
}
</style>

<script setup>
import { ref, computed } from 'vue'
import './information-card.css'

const props = defineProps({
  slides: {
    type: Array,
    required: true
  }
})

const currentSlide = ref(0)
const totalSlides = computed(() => props.slides.length)

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % totalSlides.value
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + totalSlides.value) % totalSlides.value
}
</script>

<template>
  <div class="info-carousel">
    <!-- Left Navigation -->
    <button
      class="nav-circle nav-circle--left"
      @click="prevSlide"
      aria-label="Previous slide"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Carousel -->
    <div class="carousel-viewport">
      <div class="carousel-inner">
        <div
          class="carousel-track"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="info-card"
          >
            <p class="info-card__question">{{ slide.question }}</p>
            <p class="info-card__answer">{{ slide.answer }}</p>
          </div>
        </div>
      </div>

      <!-- Dot indicators -->
      <div class="carousel-dots">
        <button
          v-for="(_, index) in slides"
          :key="index"
          class="carousel-dot"
          :class="{ 'carousel-dot--active': currentSlide === index }"
          @click="currentSlide = index"
          :aria-label="`Go to slide ${index + 1}`"
        ></button>
      </div>
    </div>

    <!-- Right Navigation -->
    <button
      class="nav-circle nav-circle--right"
      @click="nextSlide"
      aria-label="Next slide"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

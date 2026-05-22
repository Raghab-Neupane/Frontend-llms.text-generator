<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const API_BASE = 'http://127.0.0.1:8000'

const router = useRouter()

// Dropdown state
const showDropdown = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function closeDropdown() {
  showDropdown.value = false
}

function goToPrevious() {
  closeDropdown()
  router.push('/generator')
}

function handleLogout() {
  closeDropdown()
  localStorage.removeItem('token')
  router.push('/login')
}

// Generator state
const siteUrl = ref('')
const isGenerating = ref(false)
const generatedContent = ref('')
const errorMessage = ref('')
const crawlMeta = ref(null) // stores crawl metadata (pages processed, method, etc.)

async function handleGenerate() {
  if (!siteUrl.value.trim()) return

  isGenerating.value = true
  errorMessage.value = ''
  generatedContent.value = ''
  crawlMeta.value = null

  const token = localStorage.getItem('token')

  try {
    // STEP 1: POST to /crawl-site to trigger crawling
    const crawlResponse = await fetch(`${API_BASE}/crawl-site`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ url: siteUrl.value.trim() })
    })

    if (crawlResponse.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
      return
    }

    if (!crawlResponse.ok) {
      throw new Error(`Crawl failed with status ${crawlResponse.status}`)
    }

    const crawlData = await crawlResponse.json()

    if (crawlData.status === 'error') {
      throw new Error(crawlData.message || 'Crawl returned an error.')
    }

    // Store crawl metadata
    crawlMeta.value = {
      method: crawlData.crawl_method,
      totalPages: crawlData.total_pages_processed,
      pages: crawlData.processed_pages || []
    }

    // STEP 2: GET /llms.txt to fetch the generated file
    const llmsResponse = await fetch(`${API_BASE}/llms.txt`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (llmsResponse.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
      return
    }

    if (!llmsResponse.ok) {
      throw new Error(`Failed to fetch llms.txt (status ${llmsResponse.status})`)
    }

    generatedContent.value = await llmsResponse.text()

  } catch (err) {
    errorMessage.value = err.message || 'Failed to generate. Please check the URL and try again.'
  } finally {
    isGenerating.value = false
  }
}

function handleCopy() {
  navigator.clipboard.writeText(generatedContent.value)
}

function handleDownload() {
  const blob = new Blob([generatedContent.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'llms.txt'
  a.click()
  URL.revokeObjectURL(url)
}

function handleClear() {
  generatedContent.value = ''
  siteUrl.value = ''
  errorMessage.value = ''
  crawlMeta.value = null
}
</script>

<template>
  <div class="new-gen-page" @click="closeDropdown">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-logo">
        <span class="navbar-logo-text">LLMS.txt</span>
        <span class="navbar-logo-accent">generator</span>
      </div>

      <div class="navbar-right" @click.stop>
        <button class="user-btn" @click="toggleDropdown" aria-label="User menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Dropdown -->
        <Transition name="dropdown">
          <div v-if="showDropdown" class="dropdown-menu">
            <button class="dropdown-item" @click="goToPrevious">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              View my previous llms.txt
            </button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item dropdown-item--danger" @click="handleLogout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Logout
            </button>
          </div>
        </Transition>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="gen-main">
      <!-- Title -->
      <div class="gen-header">
        <h1 class="gen-title">
          LLMS.txt <span class="gen-title-accent">generator</span>
        </h1>
        <p class="gen-subtitle">Start generating your llms.txt file</p>
      </div>

      <!-- URL Input -->
      <div class="gen-input-section">
        <div class="gen-input-wrapper">
          <svg class="gen-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            v-model="siteUrl"
            type="url"
            class="gen-input"
            placeholder="Enter website URL (e.g. https://example.com)"
            @keydown.enter="handleGenerate"
          />
        </div>
        <button
          class="gen-submit-btn"
          :class="{ 'gen-submit-btn--loading': isGenerating }"
          :disabled="isGenerating || !siteUrl.trim()"
          @click="handleGenerate"
        >
          <span v-if="!isGenerating">Generate</span>
          <span v-else class="gen-spinner"></span>
        </button>
      </div>

      <!-- Error Message -->
      <p v-if="errorMessage" class="gen-error">{{ errorMessage }}</p>

      <!-- Crawl Metadata -->
      <div v-if="crawlMeta" class="gen-meta">
        <span class="gen-meta-item">
          <strong>{{ crawlMeta.totalPages }}</strong> pages processed
        </span>
        <span class="gen-meta-divider">·</span>
        <span class="gen-meta-item">
          via <strong>{{ crawlMeta.method }}</strong>
        </span>
      </div>

      <!-- Results Area -->
      <div class="gen-results" :class="{ 'gen-results--active': generatedContent || isGenerating }">
        <div class="gen-results-header">
          <span class="gen-results-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            llms.txt output
          </span>
          <div v-if="generatedContent" class="gen-results-actions">
            <button class="gen-action-btn" @click="handleCopy" title="Copy to clipboard">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              Copy
            </button>
            <button class="gen-action-btn" @click="handleDownload" title="Download file">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Download
            </button>
            <button class="gen-action-btn" @click="handleClear" title="Clear output">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Clear
            </button>
          </div>
        </div>

        <div class="gen-results-body">
          <!-- Loading state -->
          <div v-if="isGenerating" class="gen-loading">
            <div class="gen-loading-dots">
              <span></span><span></span><span></span>
            </div>
            <p>Crawling and generating llms.txt...</p>
          </div>

          <!-- Generated content -->
          <pre v-else-if="generatedContent" class="gen-output">{{ generatedContent }}</pre>

          <!-- Empty state -->
          <div v-else class="gen-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" opacity="0.3">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="1"/>
            </svg>
            <p>Enter a URL above and click Generate<br/>to create your llms.txt file.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ===== Page ===== */
.new-gen-page {
  min-height: 100vh;
  background: #fafafa;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

/* ===== Navbar ===== */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: #111111;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-logo {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.navbar-logo-text {
  font-size: 1.1rem;
  font-weight: 400;
  color: #ffffff;
  letter-spacing: -0.3px;
}

.navbar-logo-accent {
  font-size: 1.1rem;
  font-weight: 700;
  font-style: italic;
  color: #ffffff;
}

.navbar-right {
  position: relative;
}

.user-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  outline: none;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

/* ===== Dropdown ===== */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06);
  min-width: 240px;
  padding: 6px;
  z-index: 200;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: none;
  border-radius: 8px;
  font-size: 0.88rem;
  font-family: inherit;
  color: #333333;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item--danger {
  color: #cc3333;
}

.dropdown-item--danger:hover {
  background: #fef2f2;
}

.dropdown-divider {
  height: 1px;
  background: #eeeeee;
  margin: 4px 8px;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* ===== Main Content ===== */
.gen-main {
  flex: 1;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 24px;
}

/* ===== Header ===== */
.gen-header {
  text-align: center;
  margin-bottom: 36px;
}

.gen-title {
  font-size: 2.2rem;
  font-weight: 300;
  color: #111111;
  letter-spacing: -0.5px;
  margin: 0 0 6px 0;
}

.gen-title-accent {
  font-weight: 700;
  font-style: italic;
}

.gen-subtitle {
  font-size: 0.92rem;
  font-style: italic;
  color: #999999;
  margin: 0;
}

/* ===== Input Section ===== */
.gen-input-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.gen-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0 16px;
  transition: all 0.25s ease;
}

.gen-input-wrapper:focus-within {
  border-color: #111111;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
}

.gen-input-icon {
  color: #aaaaaa;
  flex-shrink: 0;
  margin-right: 10px;
}

.gen-input-wrapper:focus-within .gen-input-icon {
  color: #333333;
}

.gen-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 14px 0;
  font-size: 0.95rem;
  font-family: inherit;
  color: #111111;
}

.gen-input::placeholder {
  color: #bbbbbb;
}

.gen-submit-btn {
  padding: 14px 28px;
  background: #111111;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  flex-shrink: 0;
}

.gen-submit-btn:hover:not(:disabled) {
  background: #2a2a2a;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.gen-submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.gen-submit-btn--loading {
  pointer-events: none;
}

.gen-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== Error ===== */
.gen-error {
  color: #cc3333;
  font-size: 0.85rem;
  margin: -16px 0 16px 0;
}

/* ===== Crawl Metadata ===== */
.gen-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f0f0f0;
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 0.82rem;
  color: #666666;
}

.gen-meta-item strong {
  color: #111111;
  font-weight: 700;
}

.gen-meta-divider {
  color: #cccccc;
}

/* ===== Results Area ===== */
.gen-results {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.gen-results--active {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.gen-results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.gen-results-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.gen-results-actions {
  display: flex;
  gap: 8px;
}

.gen-action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
  font-size: 0.78rem;
  font-family: inherit;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.gen-action-btn:hover {
  background: #f5f5f5;
  border-color: #cccccc;
  color: #333333;
}

.gen-results-body {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

/* ===== Loading State ===== */
.gen-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.gen-loading p {
  font-size: 0.88rem;
  color: #999999;
}

.gen-loading-dots {
  display: flex;
  gap: 6px;
}

.gen-loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cccccc;
  animation: dot-bounce 1.4s ease-in-out infinite;
}

.gen-loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.gen-loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* ===== Output ===== */
.gen-output {
  padding: 24px;
  margin: 0;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.85rem;
  line-height: 1.75;
  color: #d4d4d4;
  background: #1a1a1a;
  white-space: pre-wrap;
  word-wrap: break-word;
  min-height: 300px;
}

/* ===== Empty State ===== */
.gen-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  color: #cccccc;
}

.gen-empty p {
  font-size: 0.88rem;
  text-align: center;
  line-height: 1.6;
  color: #bbbbbb;
}

/* ===== Responsive: Tablet ===== */
@media (max-width: 900px) {
  .gen-main {
    padding: 36px 20px;
  }

  .gen-title {
    font-size: 1.8rem;
  }
}

/* ===== Responsive: Mobile ===== */
@media (max-width: 600px) {
  .navbar {
    padding: 14px 16px;
  }

  .navbar-logo-text,
  .navbar-logo-accent {
    font-size: 0.95rem;
  }

  .gen-main {
    padding: 28px 16px;
  }

  .gen-title {
    font-size: 1.5rem;
  }

  .gen-input-section {
    flex-direction: column;
    gap: 10px;
  }

  .gen-submit-btn {
    width: 100%;
    min-width: auto;
  }

  .gen-results-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .gen-action-btn {
    font-size: 0.75rem;
    padding: 5px 10px;
  }
}
</style>

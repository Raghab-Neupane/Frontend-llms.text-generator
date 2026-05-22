<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import './side-menu.css'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const API_BASE = 'http://127.0.0.1:8000'
const router = useRouter()

const historyItems = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const selectedItem = ref(null)

// Format date to readable local string
function formatDate(isoString) {
  if (!isoString) return ''
  try {
    const date = new Date(isoString)
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return isoString
  }
}

// Extract domain from URL
function getDomain(url) {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace('www.', '')
  } catch (e) {
    return url
  }
}

// Fetch history from backend
async function fetchHistory() {
  isLoading.value = true
  errorMessage.value = ''
  
  const token = localStorage.getItem('token')
  if (!token) {
    isLoading.value = false
    emit('close')
    router.push('/login')
    return
  }

  try {
    const response = await fetch(`${API_BASE}/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.status === 401) {
      localStorage.removeItem('token')
      emit('close')
      router.push('/login')
      return
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch history (status ${response.status})`)
    }

    const data = await response.json()
    historyItems.value = data
  } catch (e) {
    console.error('Error fetching history:', e)
    errorMessage.value = 'Failed to load history items.'
  } finally {
    isLoading.value = false
  }
}

// Close and clear preview state
function handleClose() {
  selectedItem.value = null
  emit('close')
}

// Copy markdown to clipboard
function handleCopy() {
  if (selectedItem.value?.llms_txt) {
    navigator.clipboard.writeText(selectedItem.value.llms_txt)
  }
}

// Download markdown file
function handleDownload() {
  if (!selectedItem.value?.llms_txt) return
  const blob = new Blob([selectedItem.value.llms_txt], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${selectedItem.value.title.toLowerCase()}_llms.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// Select item to preview
function selectItem(item) {
  if (selectedItem.value?.url === item.url) {
    // Toggle close if clicking same item
    selectedItem.value = null
  } else {
    selectedItem.value = item
  }
}

// Watch isOpen to fetch data on open
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchHistory()
  } else {
    selectedItem.value = null
  }
})
</script>

<template>
  <div>
    <!-- Backdrop Overlay -->
    <Transition name="fade-overlay">
      <div 
        v-if="isOpen" 
        class="side-menu-overlay" 
        @click="handleClose"
      ></div>
    </Transition>

    <!-- Slide-in Drawer Container -->
    <Transition name="slide-menu">
      <div 
        v-if="isOpen" 
        class="side-menu-container" 
        :class="{ 'side-menu-container--wide': selectedItem }"
      >
        <!-- History List Pane -->
        <div class="side-menu-list-pane">
          <!-- Header -->
          <div class="side-menu-header">
            <div class="side-menu-title-area">
              <h2 class="side-menu-title">Search History</h2>
              <p class="side-menu-subtitle">Your previously generated sites</p>
            </div>
            <button class="close-btn" @click="handleClose" aria-label="Close menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- History Items list -->
          <div class="side-menu-history-list">
            <!-- Loading -->
            <div v-if="isLoading" class="history-loading">
              <div class="history-spinner"></div>
              <p>Loading history...</p>
            </div>

            <!-- Error -->
            <div v-else-if="errorMessage" class="history-empty">
              <p>{{ errorMessage }}</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="historyItems.length === 0" class="history-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p>No history items found.<br/>Generate your first llms.txt above.</p>
            </div>

            <!-- List items -->
            <div 
              v-else 
              v-for="item in historyItems" 
              :key="item.url" 
              class="history-item"
              :class="{ 'history-item--active': selectedItem && selectedItem.url === item.url }"
              @click="selectItem(item)"
            >
              <div class="history-item-badge">
                {{ getDomain(item.url)[0] || 'G' }}
              </div>
              <div class="history-item-info">
                <h4 class="history-item-title">{{ item.title }}</h4>
                <p class="history-item-url">{{ getDomain(item.url) }}</p>
                <span class="history-item-time">{{ formatDate(item.timestamp) }}</span>
              </div>
              <div class="history-item-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Pane (Only displays when selectedItem is active) -->
        <Transition name="fade-overlay">
          <div v-if="selectedItem" class="side-menu-preview-pane">
            <div class="preview-header">
              <div class="preview-title-area">
                <h3 class="preview-title">{{ selectedItem.title }}</h3>
                <a :href="selectedItem.url" target="_blank" class="preview-url">{{ getDomain(selectedItem.url) }}</a>
              </div>
              <div class="preview-actions">
                <button class="preview-btn" @click="handleCopy" title="Copy output">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy
                </button>
                <button class="preview-btn" @click="handleDownload" title="Download file">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download
                </button>
                <button class="preview-btn preview-btn--close" @click="selectedItem = null" title="Close preview">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div class="preview-body">
              <pre class="preview-code-block">{{ selectedItem.llms_txt }}</pre>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

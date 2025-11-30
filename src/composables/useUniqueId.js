// composables/useUniqueId.js
import { ref, onUnmounted } from 'vue'

/**
 * Enhanced ID generation with SSR safety and memory management
 * Uses crypto.randomUUID() when available, falls back to enhanced random generation
 */

// Global state for memory management
const activeIds = new Set()
const fallbackCounter = { value: 0 }

// SSR detection
const isServerSide = typeof window === 'undefined'

/**
 * Enhanced fallback ID generation with SSR considerations
 */
function generateFallbackId() {
  const timestamp = Date.now().toString(36)
  const random1 = Math.random().toString(36).substring(2, 8)
  const random2 = Math.random().toString(36).substring(2, 8)
  const counter = (++fallbackCounter.value).toString(36)
  
  // Add server/client prefix for SSR safety
  const prefix = isServerSide ? 'ssr' : 'csr'
  
  return `${prefix}-${timestamp}-${random1}${random2}-${counter}`
}

/**
 * Generates a unique ID using the best available method with SSR safety
 * @returns {string} Unique identifier
 */
function generateUniqueId() {
  let id
  
  // Only use crypto on client side to avoid SSR hydration mismatches
  if (!isServerSide && typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      id = `csr-${crypto.randomUUID()}`
    } catch (error) {
      console.warn('crypto.randomUUID() failed, falling back to alternative method:', error)
      id = generateFallbackId()
    }
  } else {
    // Use fallback for server-side or unsupported browsers
    id = generateFallbackId()
  }
  
  // Ensure uniqueness even across server/client boundary
  let uniqueId = id
  let attempt = 1
  while (activeIds.has(uniqueId)) {
    uniqueId = `${id}-${attempt}`
    attempt++
  }
  
  // Track active ID for memory management
  activeIds.add(uniqueId)
  
  return uniqueId
}

/**
 * Cleanup function to remove ID from tracking
 * @param {string} id - ID to cleanup
 */
function cleanupId(id) {
  activeIds.delete(id)
}

/**
 * Vue composable for generating unique IDs with memory management
 * @param {string} prefix - Optional prefix for the ID
 * @returns {Object} Object containing the generated ID and cleanup function
 */
export function useUniqueId(prefix = '') {
  const baseId = generateUniqueId()
  const finalId = prefix ? `${prefix}-${baseId}` : baseId
  const id = ref(finalId)
  
  // Auto-cleanup on component unmount
  onUnmounted(() => {
    cleanupId(finalId)
  })
  
  return {
    id: id.value,
    cleanup: () => cleanupId(finalId)
  }
}

/**
 * Generate multiple unique IDs at once with memory management
 * @param {number} count - Number of IDs to generate
 * @param {string} prefix - Optional prefix for all IDs
 * @returns {Array} Array of objects with id and cleanup function
 */
export function useMultipleUniqueIds(count, prefix = '') {
  const ids = []
  
  for (let i = 0; i < count; i++) {
    const { id, cleanup } = useUniqueId(prefix)
    ids.push({ id, cleanup })
  }
  
  // Cleanup all IDs on unmount
  onUnmounted(() => {
    ids.forEach(({ cleanup }) => cleanup())
  })
  
  return ids
}

/**
 * Utility function for direct ID generation without Vue reactivity
 * Manual cleanup required when using this function
 * @param {string} prefix - Optional prefix for the ID
 * @returns {Object} Object with ID and cleanup function
 */
export function createUniqueId(prefix = '') {
  const baseId = generateUniqueId()
  const finalId = prefix ? `${prefix}-${baseId}` : baseId
  
  return {
    id: finalId,
    cleanup: () => cleanupId(finalId)
  }
}

/**
 * Manual cleanup for all tracked IDs (useful for app shutdown)
 */
export function cleanupAllIds() {
  activeIds.clear()
  fallbackCounter.value = 0
}

/**
 * Get current memory usage stats
 * @returns {Object} Stats about active IDs
 */
export function getIdStats() {
  return {
    activeCount: activeIds.size,
    counterValue: fallbackCounter.value,
    isServerSide,
    activeIds: Array.from(activeIds) // For debugging
  }
}

// Export the core generation function for advanced use cases
export { generateUniqueId, cleanupId }

/**
 * Example usage:
 * 
 * // Standard usage (auto-cleanup on unmount):
 * import { useUniqueId } from '@/composables/useUniqueId'
 * 
 * export default {
 *   setup() {
 *     const { id: inputId } = useUniqueId('input')
 *     const { id: labelId } = useUniqueId('label')
 *     
 *     return { inputId, labelId }
 *   }
 * }
 * 
 * // Manual cleanup if needed:
 * const { id, cleanup } = useUniqueId('manual')
 * // ... later
 * cleanup()
 * 
 * // For debugging memory usage:
 * import { getIdStats } from '@/composables/useUniqueId'
 * console.log(getIdStats())
 * 
 * // App shutdown cleanup:
 * import { cleanupAllIds } from '@/composables/useUniqueId'
 * // In your app's beforeUnmount or when closing
 * cleanupAllIds()
 */
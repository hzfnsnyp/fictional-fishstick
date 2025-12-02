import { ref, shallowRef, nextTick } from 'vue'

const lightboxItems = ref([])
const lightboxInstance = shallowRef(null)
const isLightboxOpen = ref(false)

export function useLightbox() {
  const openLightbox = async (items, startIndex = 0) => {
    if (!items || items.length === 0) return

    // Ensure items have required PhotoSwipe fields
    lightboxItems.value = items.map(item => {
      const imagesArray = item.images || item.thumbs || []
      const firstImage = Array.isArray(imagesArray) ? imagesArray[0] : null

      const parseNumber = (value) => {
        const n = Number(value)
        return Number.isFinite(n) ? n : 0
      }

      let pixelWidth =
        parseNumber(item.imageWidth) ||
        parseNumber(firstImage?.width) ||
        parseNumber(item.width) ||
        0

      let pixelHeight =
        parseNumber(item.imageHeight) ||
        parseNumber(firstImage?.height) ||
        parseNumber(item.height) ||
        0

      const hasRatio = Number(pixelWidth) > 0 && Number(pixelHeight) > 0
      const ratio = hasRatio ? Number(pixelWidth) / Number(pixelHeight) : 0

      // If dimensions look like centimeters or missing, fall back to sensible pixel sizes
      const isTiny = Number(pixelWidth) < 300 || Number(pixelHeight) < 300
      if (isTiny) {
        pixelWidth = 2000
        pixelHeight = ratio > 0 ? Math.round(pixelWidth / ratio) : 2000
      }

      return {
        src: item.src || item.image,
        width: pixelWidth,
        height: pixelHeight,
        alt: item.alt || item.title || '',
        title: item.title || '',
        year: item.year || '',
        medium: item.medium || '',
        dimensions: item.dimensions || ''
      }
    })

    // Wait for DOM update before opening lightbox
    await nextTick()

    if (lightboxInstance.value) {
      // Update dataSource first
      lightboxInstance.value.options.dataSource = lightboxItems.value
      // Then open
      lightboxInstance.value.loadAndOpen(startIndex)
    }
  }

  const setLightboxInstance = (instance) => {
    lightboxInstance.value = instance
  }

  const closeLightbox = () => {
    if (lightboxInstance.value?.pswp) {
      lightboxInstance.value.pswp.close()
    }
  }

  return {
    lightboxItems,
    isLightboxOpen,
    openLightbox,
    setLightboxInstance,
    closeLightbox
  }
}

<template>
  <section class="artwork-lightbox" aria-labelledby="artwork-lightbox-heading">
    <template v-if="!hidePreview">
      <header v-if="showHeader" class="artwork-lightbox__header">
        <h2 id="artwork-lightbox-heading" class="visually-hidden">Artwork preview</h2>
        <p class="artwork-lightbox__title">{{ primaryItem.caption }}</p>
        <p v-if="primaryItem.alt" class="artwork-lightbox__meta">{{ primaryItem.alt }}</p>
      </header>

      <figure
        class="artwork-lightbox__preview"
        @click="openLightbox"
        @keydown.enter.prevent="openLightbox"
        @keydown.space.prevent="openLightbox"
        role="button"
        tabindex="0"
        :aria-label="`Open ${primaryItem.caption} in lightbox`"
      >
        <img
          ref="previewImg"
          :src="primaryItem.thumbnail"
          :alt="primaryItem.alt || primaryItem.caption"
          loading="lazy"
        />
        <figcaption v-if="showCta" class="artwork-lightbox__cta">
          <ButtonComponent
            variant="secondary"
            size="small"
            @click.stop.prevent="openLightbox"
          >
            {{ ctaLabel }}
          </ButtonComponent>
        </figcaption>
      </figure>
    </template>

    <Teleport v-if="showControls" to="body">
      <div class="lightbox-overlay-controls">
        <div class="lightbox-controls-group">
          <ButtonComponent
            variant="secondary"
            size="small"
            class="lightbox-btn lightbox-btn--close"
            aria-label="Close lightbox"
            @click="handleClose"
          >
            <IconComponent name="cross" :size="24" />
          </ButtonComponent>

          <ButtonComponent
            variant="secondary"
            size="small"
            class="lightbox-btn lightbox-btn--zoom"
            aria-label="Zoom in"
            :disabled="!canZoomIn"
            @click="handleZoomIn"
          >
            <IconComponent name="zoom-in" :size="24" />
          </ButtonComponent>

          <ButtonComponent
            variant="secondary"
            size="small"
            class="lightbox-btn lightbox-btn--zoom"
            aria-label="Zoom out"
            :disabled="!canZoomOut"
            @click="handleZoomOut"
          >
            <IconComponent name="zoom-out" :size="24" />
          </ButtonComponent>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import ButtonComponent from '@/components/ui/ButtonComponent.vue'
import IconComponent from '@/components/ui/IconComponent.vue'
import { useLightbox } from '@/composables/useLightbox'
import '@/styles/vendor/photoswipe/core.css'
import '@/styles/vendor/photoswipe/theme.css'

const { setLightboxInstance } = useLightbox()

const props = defineProps({
  items: {
    type: Array,
    default: () => [
      {
        src: '/artworks/plate (38)-edit.jpg',
        thumbnail: '/artworks/plate (38)-edit.jpg',
        alt: 'Relief sculpture with layered lines',
        caption: 'Harmonic Relief — Detail view',
        width: 1600,
        height: 2000
      }
    ]
  },
  ctaLabel: {
    type: String,
    default: 'View artwork'
  },
  showHeader: {
    type: Boolean,
    default: false
  },
  backgroundColor: {
    type: String,
    default: 'var(--color-surface-primary)'
  },
  hidePreview: {
    type: Boolean,
    default: false
  }
})

const primaryItem = computed(() => props.items[0] ?? {})
const showCta = computed(() => Boolean(props.ctaLabel))

let lightbox = null
let pswpInstance = null
let savedScrollY = 0

const showControls = ref(false)
const canZoomIn = ref(true)
const canZoomOut = ref(false)
const previewImg = ref(null)

const updateZoomButtons = () => {
  if (!pswpInstance?.currSlide) return

  const slide = pswpInstance.currSlide
  const currZoom = slide.currZoomLevel
  const maxZoom = slide.zoomLevels.max
  const minZoom = slide.zoomLevels.fit

  canZoomIn.value = currZoom < maxZoom - 0.01
  canZoomOut.value = currZoom > minZoom + 0.01
}

const handleClose = () => {
  if (pswpInstance) {
    pswpInstance.close()
  }
}

const handleZoomIn = () => {
  if (!pswpInstance?.currSlide) return

  const slide = pswpInstance.currSlide
  const currZoom = slide.currZoomLevel
  const maxZoom = slide.zoomLevels.max
  const newZoom = Math.min(currZoom * 1.5, maxZoom)

  pswpInstance.zoomTo(
    newZoom,
    { x: pswpInstance.viewportSize.x / 2, y: pswpInstance.viewportSize.y / 2 },
    300
  )
}

const handleZoomOut = () => {
  if (!pswpInstance?.currSlide) return

  const slide = pswpInstance.currSlide
  const currZoom = slide.currZoomLevel
  const minZoom = slide.zoomLevels.fit
  const newZoom = Math.max(currZoom / 1.5, minZoom)

  pswpInstance.zoomTo(
    newZoom,
    { x: pswpInstance.viewportSize.x / 2, y: pswpInstance.viewportSize.y / 2 },
    300
  )
}

const openLightbox = () => {
  if (lightbox) {
    lightbox.loadAndOpen(0)
  }
}

onMounted(() => {
  lightbox = new PhotoSwipeLightbox({
    dataSource: props.items,
    pswpModule: () => import('photoswipe'),
    closeEl: false,
    captionEl: true,
    fullscreenEl: false,
    zoomEl: false,
    shareEl: false,
    counterEl: false,
    arrowEl: false,
    bgOpacity: 1,
    wheelToZoom: true,
    initialZoomLevel: 'fit',
    allowPanToNext: false,
    loop: false,
    imageClickAction: 'none',
    // Add padding: top and bottom for caption area
    paddingFn: (viewportSize) => {
      return {
        top: 60,
        bottom: 60,
        left: 0,
        right: 0
      }
    }
  })

  let captionElement = null

  lightbox.on('uiRegister', function () {
    lightbox.pswp.ui.registerElement({
      name: 'custom-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: '',
      onInit: (el, pswp) => {
        captionElement = el

        const updateCaption = () => {
          const currSlideElement = lightbox.pswp.currSlide?.data
          if (currSlideElement) {
            const metadata = []
            if (currSlideElement.title) metadata.push(currSlideElement.title)
            if (currSlideElement.year) metadata.push(currSlideElement.year)
            if (currSlideElement.medium) metadata.push(currSlideElement.medium)
            if (currSlideElement.dimensions) metadata.push(currSlideElement.dimensions)

            el.innerHTML = metadata.length > 0
              ? `<div class="pswp__custom-caption">${metadata.join(', ')}</div>`
              : ''
          }
        }

        const toggleCaptionVisibility = () => {
          if (!lightbox.pswp.currSlide) return

          const slide = lightbox.pswp.currSlide
          const currZoom = slide.currZoomLevel
          const fitZoom = slide.zoomLevels.fit

          // Hide caption when zoomed in beyond fit level
          if (currZoom > fitZoom + 0.01) {
            el.style.opacity = '0'
            el.style.pointerEvents = 'none'
          } else {
            el.style.opacity = '1'
            el.style.pointerEvents = 'none'
          }
        }

        lightbox.pswp.on('change', updateCaption)
        lightbox.pswp.on('zoomPanUpdate', toggleCaptionVisibility)

        // Initial check
        setTimeout(toggleCaptionVisibility, 100)
      }
    })
  })

  lightbox.on('afterInit', () => {
    pswpInstance = lightbox.pswp
    showControls.value = true

    savedScrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflowY = 'scroll'

    if (pswpInstance.element) {
      pswpInstance.element.style.setProperty('--pswp-bg', props.backgroundColor)
    }

    updateZoomButtons()
  })

  lightbox.on('zoomPanUpdate', updateZoomButtons)

  lightbox.on('destroy', () => {
    pswpInstance = null
    showControls.value = false

    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflowY = ''

    // Disable smooth scroll behavior, restore position instantly, then re-enable
    const html = document.documentElement
    const prevBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, savedScrollY)
    requestAnimationFrame(() => {
      html.style.scrollBehavior = prevBehavior || ''
    })
  })

  lightbox.init()

  // Register this lightbox instance globally
  setLightboxInstance(lightbox)

  watch(
    () => props.items,
    (next) => {
      if (lightbox) {
        lightbox.options.dataSource = next
      }
    },
    { deep: true }
  )
})

onBeforeUnmount(() => {
  if (lightbox) {
    lightbox.destroy()
    lightbox = null
  }
  pswpInstance = null
  showControls.value = false

  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.overflowY = ''
})

defineExpose({
  previewImg,
  openLightbox
})
</script>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.artwork-lightbox {
  display: grid;
  gap: var(--spacing-24);
}

.artwork-lightbox__header {
  display: grid;
  gap: var(--spacing-08);
}

.artwork-lightbox__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-32);
  color: var(--color-text-primary);
}

.artwork-lightbox__meta {
  margin: 0;
  font-size: var(--font-size-18);
  color: var(--color-text-secondary);
}

.artwork-lightbox__preview {
  margin: 0;
  display: grid;
  gap: var(--spacing-16);
  cursor: zoom-in;
  outline: none;
}

.artwork-lightbox__preview img {
  width: min(100%, clamp(320px, 60vw, 860px));
  height: auto;
  display: block;
  border: 1px solid var(--color-border-subtle, rgba(0, 0, 0, 0.08));
  background: var(--color-surface-secondary, #f5f3ef);
  transition: transform var(--transition-fast);
}

.artwork-lightbox__preview:focus-visible img,
.artwork-lightbox__preview:hover img {
  transform: scale(1.01);
}

.artwork-lightbox__cta {
  margin: 0;
}

@media (max-width: 768px) {
  .artwork-lightbox__title {
    font-size: var(--font-size-24);
  }

  .artwork-lightbox__preview img {
    width: 100%;
  }
}
</style>

<style>
.lightbox-overlay-controls {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100010;
}

.lightbox-controls-group {
  position: fixed;
  top: 8px;
  right: calc(max(var(--site-gutter-x), 16px));
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  z-index: 100011;
  gap: 0;
}

@media (max-width: 768px) {
  .lightbox-controls-group {
    top: 12px;
    right: calc(max(var(--site-gutter-x), 12px));
  }
}

.lightbox-btn.btn {
  width: var(--button-height-small) !important;
  height: var(--button-height-small) !important;
  min-width: var(--button-height-small) !important;
  min-height: var(--button-height-small) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
}

.lightbox-btn.btn:not(:first-child) {
  margin-top: -1px;
}

.pswp__custom-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--spacing-24);
  font-family: var(--font-body);
  font-size: var(--font-body);
  line-height: 1.5;
  color: var(--color-text-primary);
  text-align: center;
  pointer-events: none;
  transition: opacity 0.2s ease-out;
}

@media (max-width: 768px) {
  .pswp__custom-caption {
    font-size: 12px;
    height: 60px;
    padding: 0 var(--spacing-16);
  }
}

/* Lightbox disabled button styling - keep border color same as enabled */
.lightbox-overlay-controls .lightbox-btn.btn:disabled {
  border-color: var(--color-border-primary) !important;
}

/* Hide all default PhotoSwipe buttons */
:deep(.pswp__button),
:deep(.pswp__button--close),
:deep(.pswp__button--arrow),
:deep(.pswp__button--arrow--prev),
:deep(.pswp__button--arrow--next),
:deep(.pswp__button--zoom),
:deep(.pswp__counter),
:deep(.pswp__preloader) {
  display: none !important;
}
</style>

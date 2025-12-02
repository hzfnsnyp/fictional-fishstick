<template>
  <div
    class="artwork-carousel"
    :style="carouselStyle"
    role="region"
    aria-label="Featured artworks carousel"
  >
    <!-- Screen reader announcement for slide changes -->
    <div class="sr-only" aria-live="polite" aria-atomic="true">
      <span v-if="slides[currentSlideIndex]">
        Slide {{ currentSlideIndex + 1 }} of {{ slides.length }}: {{ slides[currentSlideIndex].title }}
      </span>
    </div>

    <!-- Основная карусель -->
    <div class="artwork-carousel__main">
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="0"
        :navigation="{
          nextEl: `.swiper-button-next-${uniqueId}`,
          prevEl: `.swiper-button-prev-${uniqueId}`,
        }"
        :thumbs="{ swiper: thumbsSwiper }"
        :speed="600"
        :auto-height="true"
        @swiper="setMainSwiper"
        class="main-swiper"
      >
        <SwiperSlide 
          v-for="(slide, index) in slides" 
          :key="index"
          :data-slide-index="index"
        >
          <div class="artwork-slide">
            <div class="artwork-slide__content">
              <div
                class="artwork-slide__image-wrapper"
                @click="handleImageClick(index)"
                role="button"
                :tabindex="currentSlideIndex === index ? 0 : -1"
                @keydown.enter.prevent="handleImageClick(index)"
                @keydown.space.prevent="handleImageClick(index)"
                :aria-label="`Open ${slide.title} in lightbox`"
                :aria-hidden="currentSlideIndex !== index"
              >
                <img
                  :src="slide.src"
                  :alt="slide.title"
                  class="artwork-slide__image"
                  loading="lazy"
                  @load="handleImageLoad($event, index)"
                  @error="handleImageError(index)"
                />
              </div>
              <div
                class="artwork-slide__metadata"
                @click="handleImageClick(index)"
                :aria-label="`View ${slide.title} in lightbox`"
              >
                <h3 class="artwork-slide__title">
                  {{ slide.title }}
                </h3>
                <div class="artwork-slide__details">
                  <p v-if="slide.year" class="artwork-slide__year">
                    {{ slide.year }}
                  </p>
                  <p
                    v-if="slide.medium || slide.dimensions"
                    class="artwork-slide__medium-dimensions"
                  >
                    <span v-if="slide.medium">{{ slide.medium }}</span>
                    <span v-if="slide.medium && slide.dimensions">, </span>
                    <span v-if="slide.dimensions">{{ slide.dimensions }}</span>
                  </p>
                  <p
                    v-if="formatMobileMetadata(slide)"
                    class="artwork-slide__details-mobile"
                  >
                    {{ formatMobileMetadata(slide) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <!-- Кнопки навигации с уникальными классами -->
        <button
          type="button"
          :class="`swiper-button-prev swiper-button-prev-${uniqueId}`"
          aria-label="Previous slide"
        ></button>
        <button
          type="button"
          :class="`swiper-button-next swiper-button-next-${uniqueId}`"
          aria-label="Next slide"
        ></button>
      </Swiper>
    </div>

    <!-- Thumbnail карусель -->
    <div class="artwork-carousel__thumbs">
      <Swiper
        :modules="modules"
        :slides-per-view="'auto'"
        :space-between="4"
        :watch-slides-progress="true"
        :free-mode="true"
        @swiper="setThumbsSwiper"
        class="thumbs-swiper"
      >
        <SwiperSlide
          v-for="(slide, index) in slides"
          :key="index"
          class="thumb-slide"
          :style="{ height: `${getThumbnailHeight(slide)}px` }"
        >
          <div
            class="thumb-slide__wrapper"
            :class="{ 'thumb-slide__wrapper--active': currentSlideIndex === index }"
            role="button"
            :tabindex="currentSlideIndex === index ? -1 : 0"
            :aria-label="`Go to slide ${index + 1}: ${slide.title}`"
            :aria-current="currentSlideIndex === index ? 'true' : undefined"
            :aria-disabled="currentSlideIndex === index ? 'true' : 'false'"
            @click="goToSlide(index)"
            @keydown.enter.prevent="goToSlide(index)"
            @keydown.space.prevent="goToSlide(index)"
          >
            <img
              :src="slide.src"
              :alt="slide.title"
              class="thumb-slide__image"
              loading="lazy"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { useUniqueId } from '@/composables/useUniqueId';
import { useLightbox } from '@/composables/useLightbox';

// Импорт стилей Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const props = defineProps({
  slides: {
    type: Array,
    required: true,
    default: () => [
      {
        src: '/path/to/image1.jpg',
        title: 'Glass Fields',
        year: '2022',
        medium: 'Glass and resin',
        dimensions: '80 × 65 cm',
        width: 800,
        height: 1200,
      },
    ],
  },
});

// Используем composable для генерации уникального ID
// Автоматическая очистка при размонтировании компонента
const { id: uniqueId } = useUniqueId('carousel');

// Lightbox для открытия изображений
const { openLightbox } = useLightbox();

const modules = [Navigation, Thumbs, FreeMode];
const mainSwiper = ref(null);
const thumbsSwiper = ref(null);
const imageWidths = ref(new Map());
const imageNaturalSizes = ref(new Map());
const currentSlideIndex = ref(0);
const resizeObservers = new Map();

// Обработчик клика по изображению - открыть lightbox
const handleImageClick = (index) => {
  const enrichedSlides = props.slides.map((slide, idx) => {
    const natural = imageNaturalSizes.value.get(idx);
    return {
      ...slide,
      width: natural?.width || slide.width,
      height: natural?.height || slide.height
    };
  });
  openLightbox(enrichedSlides, index);
};

// Нативная реализация debounce
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const maxAspectRatio = computed(() => {
  if (!Array.isArray(props.slides) || props.slides.length === 0) {
    return 1;
  }

  return props.slides.reduce((max, slide) => {
    const width = Number(slide.width);
    const height = Number(slide.height);

    if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
      const ratio = height / width;
      return ratio > max ? ratio : max;
    }

    return max;
  }, 1);
});

const carouselStyle = computed(() => ({
  '--carousel-max-aspect': maxAspectRatio.value || 1,
  '--current-image-width': `${imageWidths.value.get(currentSlideIndex.value) || 0}px`,
}));

// Debounced обновление индекса для плавности
const updateCurrentIndex = debounce((index) => {
  currentSlideIndex.value = index;
}, 50);

const setMainSwiper = (swiper) => {
  mainSwiper.value = swiper;

  const updateNavigationTabindex = () => {
    const prevButton = document.querySelector(`.swiper-button-prev-${uniqueId}`);
    const nextButton = document.querySelector(`.swiper-button-next-${uniqueId}`);

    if (prevButton) {
      const isDisabled = prevButton.classList.contains('swiper-button-disabled');
      prevButton.setAttribute('tabindex', isDisabled ? '-1' : '0');
    }

    if (nextButton) {
      const isDisabled = nextButton.classList.contains('swiper-button-disabled');
      nextButton.setAttribute('tabindex', isDisabled ? '-1' : '0');
    }
  };

  const handleSlideChange = () => {
    updateCurrentIndex(swiper.activeIndex);
    updateNavigationTabindex();
  };

  // Отслеживаем смену слайда
  swiper.on('slideChange', handleSlideChange);

  // Настройка accessibility для кнопок навигации
  const setupNavigationButtons = () => {
    const prevButton = document.querySelector(`.swiper-button-prev-${uniqueId}`);
    const nextButton = document.querySelector(`.swiper-button-next-${uniqueId}`);

    if (prevButton) {
      prevButton.setAttribute('tabindex', '0');
      prevButton.setAttribute('role', 'button');
      prevButton.setAttribute('aria-label', 'Previous artwork');
      prevButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          swiper.slidePrev();
        }
      });
    }

    if (nextButton) {
      nextButton.setAttribute('tabindex', '0');
      nextButton.setAttribute('role', 'button');
      nextButton.setAttribute('aria-label', 'Next artwork');
      nextButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          swiper.slideNext();
        }
      });
    }
  };

  // Настраиваем кнопки после инициализации
  setTimeout(() => {
    setupNavigationButtons();
    updateNavigationTabindex();
  }, 100);

  // Очистка при unmount
  onBeforeUnmount(() => {
    swiper?.off('slideChange', handleSlideChange);
    // Очищаем все ResizeObserver
    resizeObservers.forEach(observer => observer.disconnect());
    resizeObservers.clear();
  });
};

// Обновление ширины изображения
const updateImageWidth = (index) => {
  const img = document.querySelector(`[data-slide-index="${index}"] .artwork-slide__image`);
  if (img && img.offsetWidth > 0) {
    imageWidths.value.set(index, img.offsetWidth);
    if (index === currentSlideIndex.value) {
      imageWidths.value = new Map(imageWidths.value);
    }
  }
};

const handleImageLoad = (event, index) => {
  const img = event.target;
  
  // Проверяем, что изображение действительно загружено
  if (img.complete && img.naturalWidth !== 0) {
    let width = img.offsetWidth;

    // Защита от offsetWidth = 0
    if (width <= 0) {
      // Fallback: используем naturalWidth с ограничением
      const naturalWidth = img.naturalWidth;
      if (naturalWidth > 0) {
        width = Math.min(naturalWidth, 860);
      }
    }
    
    if (width > 0) {
      imageWidths.value.set(index, width);
      if (img.naturalWidth && img.naturalHeight) {
        imageNaturalSizes.value.set(index, {
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      }
      if (index === currentSlideIndex.value) {
        imageWidths.value = new Map(imageWidths.value);
      }
    }
  }
};

// Обработка ошибки загрузки изображения
const handleImageError = (index) => {
  // Устанавливаем fallback ширину при ошибке
  imageWidths.value.set(index, 360); // минимальная ширина
  if (index === currentSlideIndex.value) {
    imageWidths.value = new Map(imageWidths.value);
  }
};

// Проверка кэшированных изображений и настройка ResizeObserver
onMounted(() => {
  // Проверяем все изображения, которые могли загрузиться из кэша
  const images = document.querySelectorAll('.artwork-slide__image');
  images.forEach((img, index) => {
    if (img.complete && img.naturalWidth !== 0) {
      handleImageLoad({ target: img }, index);
    }
  });
  
  // Отслеживаем изменение размера текущего изображения
  watch(currentSlideIndex, (newIndex) => {
    const img = document.querySelector(`[data-slide-index="${newIndex}"] .artwork-slide__image`);
    if (img) {
      // Отключаем предыдущий observer если был
      const existingObserver = resizeObservers.get(newIndex);
      if (existingObserver) {
        existingObserver.disconnect();
      }
      
      // Создаем новый ResizeObserver
      const resizeObserver = new ResizeObserver(() => {
        updateImageWidth(newIndex);
      });
      
      resizeObserver.observe(img);
      resizeObservers.set(newIndex, resizeObserver);
    }
  }, { immediate: true });
});

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

// Navigate to specific slide (for keyboard navigation)
const goToSlide = (index) => {
  if (mainSwiper.value && index >= 0 && index < props.slides.length) {
    mainSwiper.value.slideTo(index);
  }
};

const formatMobileMetadata = (slide) => {
  return [slide.year, slide.medium, slide.dimensions]
    .filter(Boolean)
    .join(', ');
};

// Вычисляем высоту thumbnail на основе aspect ratio
const getThumbnailHeight = (slide) => {
  if (!slide.width || !slide.height) return 50;

  const aspectRatio = slide.width / slide.height;

  if (aspectRatio < 0.9) {
    return 60;
  } else if (aspectRatio >= 0.9 && aspectRatio <= 1.1) {
    return 50;
  } else {
    return 40;
  }
};
</script>

<style scoped>
.artwork-carousel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: auto;
  padding: var(--spacing-20);
  overflow: hidden;
}

:deep(.main-swiper) {
  width: 100% !important;
  max-width: 100%;
}

:deep(.main-swiper .swiper-wrapper),
:deep(.main-swiper .swiper-slide) {
  width: 100% !important;
  max-width: 100%;
}

:deep(.main-swiper .swiper-slide) {
  flex: 0 0 100% !important;
}

/* Основная карусель */
.artwork-carousel__main {
  position: relative;
}

.main-swiper {
  width: 100%;
}

.artwork-slide {
  display: flex;
  align-items: center;
  padding-inline: calc(
    var(--spacing-40) + var(--spacing-20)
  );
  padding-block: var(--spacing-40) var(--spacing-8);
}

.artwork-slide__content {
  display: grid;
  grid-template-columns: minmax(clamp(520px, 60vw, 1040px), 1fr) minmax(320px, 0.6fr);
  gap: var(--spacing-32);
  align-items: flex-start;
  max-width: min(100%, 1280px);
  margin-inline: auto;
}

.artwork-slide__image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: clamp(520px, 60vw, 1040px);
  height: clamp(480px, 65vh, 820px);
  cursor: pointer;
  outline: none;
  transition: opacity 0.2s ease;
}

.artwork-slide__image-wrapper:focus-visible {
  box-shadow: var(--shadow-focus-ring);
}

.artwork-slide__image-wrapper:hover {
  opacity: 0.95;
}

.artwork-slide__image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  cursor: pointer;
}

.artwork-slide__metadata {
  min-width: min-content;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  justify-content: flex-end;
  align-items: flex-start;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  align-self: end;
}

.artwork-slide__title {
  margin: 0;
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-heading);
  color: var(--color-text-primary) !important;
  transition: color var(--transition-normal);
}

.artwork-slide__year {
  margin: 0;
  font-size: var(--font-size-18);
  line-height: var(--line-height-metadata);
  color: var(--color-text-secondary);
}

.artwork-slide__medium-dimensions {
  margin: 0;
  font-size: var(--font-size-18);
  line-height: var(--line-height-metadata);
  color: var(--color-text-secondary);
}

.artwork-slide__details-mobile {
  display: none;
  margin: 0;
  font-size: var(--font-size-18);
  line-height: var(--line-height-metadata);
  color: var(--color-text-secondary);
}

@media (hover: hover) and (pointer: fine) {
  .artwork-slide__metadata:hover .artwork-slide__title {
    color: var(--color-brand-primary) !important;
  }
}

.artwork-slide__metadata:active .artwork-slide__title {
  color: var(--color-interactive-pressed) !important;
}

/* Thumbnail карусель */
.artwork-carousel__thumbs {
  --thumb-track-height: max(
    4rem,
    calc(var(--spacing-48) + var(--spacing-16))
  );
  flex-shrink: 0;
  width: 100%;
  height: var(--thumb-track-height);
  position: relative;
}

.thumbs-swiper {
  width: 100%;
  height: 100%;
  padding-bottom: calc(
    var(--spacing-8) / 2
  );
}

.thumb-slide {
  width: auto !important;
  cursor: pointer;
  transition: transform 0.3s ease;
  overflow: visible; /* allow focus ring to show fully */
}

.thumb-slide:hover,
.thumb-slide.swiper-slide-thumb-active {
  transform: translateY(calc(var(--spacing-8) / 2));
}

.thumb-slide__wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  opacity: 0.6;
  transition: opacity 0.3s ease, box-shadow 0.2s ease;
  position: relative;
  outline: none;
  padding: 1px; /* small inset from image */
  box-sizing: border-box;
}

/* Remove default focus outline */
.thumb-slide__wrapper:focus {
  outline: none;
}

/* Custom focus styles - keyboard navigation */
.custom-focus-system .thumb-slide__wrapper.focus-visible,
.thumb-slide__wrapper:focus-visible {
  /* Outline drawn inside so it isn't clipped; keeps image full size */
  outline: 2px solid rgba(145, 9, 11, 0.7);
  outline-offset: -2px; /* compensate for 1px padding so outer size stays the same */
  opacity: 1 !important;
}

.thumb-slide:hover .thumb-slide__wrapper,
.thumb-slide.swiper-slide-thumb-active .thumb-slide__wrapper {
  opacity: 1;
}

.thumb-slide__image {
  height: 100%;
  width: auto;
  object-fit: contain;
  display: block;
}

.thumb-slide__wrapper--active {
  pointer-events: none;
}

/* Навигационные кнопки */
.swiper-button-prev,
.swiper-button-next {
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color var(--transition-fast);
  background: transparent;
  border: none;
  padding: 0;
}

.swiper-button-prev:after,
.swiper-button-next:after {
  font-size: var(--font-size-24);
}

@media (hover: hover) and (pointer: fine) {
  .swiper-button-prev:hover,
  .swiper-button-next:hover {
    color: var(--color-brand-primary);
  }
}

.swiper-button-prev:focus-visible,
.swiper-button-next:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
}

.swiper-button-prev:active,
.swiper-button-next:active {
  color: var(--color-interactive-pressed);
}

.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  color: var(--color-text-disabled);
  opacity: 0.4;
  cursor: not-allowed;
}

/* Мобильная версия */
@media (max-width: 768px) {
  .artwork-carousel {
    padding: var(--spacing-16);
    gap: var(--spacing-8);
  }

  .artwork-carousel__main {
    max-height: none;
  }

  .main-swiper {
    height: auto;
  }

  .artwork-slide {
    padding-inline: var(--spacing-20);
    padding-block: var(--spacing-32) var(--spacing-8);
    align-items: center;
    justify-content: center;
  }

    .artwork-slide__content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-8);
      align-items: center;
      justify-content: center;
    }

    .artwork-slide__image-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 5 / 7;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0; /* no inner gap so image fills the frame */
      flex: 0 0 auto;
      min-height: 0;
      max-height: min(80vh, calc(100vw * 7 / 5)); /* keep 5x7 frame without stretching */
    }

    .artwork-slide__image {
      width: 100%;
      height: 100%;
    object-fit: contain;
  }

  .artwork-slide__metadata {
    width: 100%;
    flex: 0 0 auto;
    justify-content: flex-start;
    margin-top: var(--spacing-8);
    max-width: 100%;
    align-items: center;
    text-align: center;
  }

  .artwork-slide__title {
    font-size: var(--font-size-20);
  }

  .artwork-slide__year,
  .artwork-slide__medium-dimensions {
    display: none;
  }

  .artwork-slide__details-mobile {
    display: block;
    font-size: var(--font-size-14);
  }

  /* На мобильном все thumbnail видны всегда */
  .thumb-slide__wrapper {
    opacity: 1;
  }

  .thumb-slide:hover {
    transform: none;
  }

  .thumb-slide.swiper-slide-thumb-active {
    transform: translateY(calc(var(--spacing-8) / 2));
  }

  .swiper-button-prev:after,
  .swiper-button-next:after {
    font-size: var(--font-size-20);
  }

  /* Скрываем кнопки на мобильном */
  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }
}

/* Скрываем превью на десктопе для неактивных слайдов без hover */
@media (min-width: 769px) {
.thumb-slide:not(:hover):not(.swiper-slide-thumb-active)
  .thumb-slide__wrapper {
  opacity: 0.3;
}
}
</style>

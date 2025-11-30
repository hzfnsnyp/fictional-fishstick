<!-- FILE: src/views/NotFoundView.vue -->
<!-- 404 Error Page - Page not found -->

<template>
  <main class="not-found">
    <div class="not-found__content">
      <div class="not-found__title" aria-hidden="true">404</div>
      <h1 class="not-found__subtitle">Page Not Found</h1>
      <p class="not-found__description">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div class="not-found__actions">
        <ButtonComponent
          variant="primary"
          size="medium"
          @click="goHome"
        >
          Return Home
        </ButtonComponent>

        <ButtonComponent
          variant="secondary"
          size="medium"
          @click="goToArtworks"
        >
          Browse Artworks
        </ButtonComponent>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useSEO } from '@/composables/useSEO';

const router = useRouter();

// Set SEO meta tags
const { setSEO } = useSEO();

onMounted(() => {
  setSEO({
    title: '404 - Page Not Found',
    description: 'The page you are looking for could not be found.',
    noindex: true, // Don't index 404 pages
  });
});

const goHome = () => router.push('/');
const goToArtworks = () => router.push('/artworks');
</script>

<style scoped>
/* ==========================================================================
   NOT FOUND PAGE STYLES
   ========================================================================== */

.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-48);
}

.not-found__content {
  max-width: 600px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-20);
}

.not-found__title {
  font-size: clamp(48px, 10vw, 64px);
  font-weight: var(--font-weight-bold);
  line-height: 1;
  color: var(--color-text-secondary);
  margin: 0;
}

.not-found__subtitle {
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.not-found__description {
  font-size: var(--font-size-18);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.not-found__actions {
  display: flex;
  gap: var(--spacing-16);
  flex-wrap: wrap;
  justify-content: center;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .not-found {
    padding: var(--spacing-32);
  }

  .not-found__title {
    font-size: 48px;
  }

  .not-found__subtitle {
    font-size: var(--font-size-24);
  }

  .not-found__description {
    font-size: var(--font-size-16);
  }

  .not-found__actions {
    flex-direction: column;
    width: 100%;
  }
}
</style>

<template>
  <div class="error-fallback" role="alert" aria-live="assertive">
    <div class="error-fallback__content">
      <h1 class="error-fallback__title">Something Went Wrong</h1>

      <p class="error-fallback__message">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>

      <div v-if="showDetails && errorMessage" class="error-fallback__details">
        <details>
          <summary>Error details</summary>
          <pre>{{ errorMessage }}</pre>
        </details>
      </div>

      <div class="error-fallback__actions">
        <ButtonComponent
          variant="primary"
          size="medium"
          @click="handleReload"
        >
          Reload page
        </ButtonComponent>
        <ButtonComponent
          variant="secondary"
          size="medium"
          @click="handleGoHome"
        >
          Go to homepage
        </ButtonComponent>
      </div>

      <p class="error-fallback__support">
        If this problem persists, please contact support or try again later.
      </p>
    </div>
  </div>
</template>

<script>
import ButtonComponent from './ButtonComponent.vue';

export default {
  name: 'ErrorFallback',
  components: {
    ButtonComponent
  },
  props: {
    error: {
      type: [Error, String],
      default: null
    },
    showDetails: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    errorMessage() {
      if (!this.error) return '';
      if (typeof this.error === 'string') return this.error;
      return this.error.message || 'Unknown error';
    }
  },
  methods: {
    handleReload() {
      window.location.reload();
    },
    handleGoHome() {
      window.location.href = '/';
    }
  }
}
</script>

<style scoped>
.error-fallback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-48);
  background: var(--color-surface-primary);
}

.error-fallback__content {
  max-width: 600px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-20);
}

.error-fallback__title {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.error-fallback__message {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-18);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
}

.error-fallback__details {
  width: 100%;
  text-align: left;
}

.error-fallback__details details {
  background: var(--color-surface-secondary);
  padding: var(--spacing-16);
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.error-fallback__details summary {
  cursor: pointer;
  font-family: var(--font-body);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  user-select: none;
}

.error-fallback__details summary:hover {
  color: var(--color-brand-primary);
}

.error-fallback__details pre {
  margin-top: var(--spacing-12);
  margin-bottom: 0;
  padding: var(--spacing-12);
  background: var(--color-surface-primary);
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-12);
  color: var(--color-text-secondary);
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.error-fallback__actions {
  display: flex;
  gap: var(--spacing-16);
  flex-wrap: wrap;
  justify-content: center;
}

.error-fallback__support {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-14);
  color: var(--color-text-tertiary);
}

@media (max-width: 768px) {
  .error-fallback {
    padding: var(--spacing-32);
  }

  .error-fallback__title {
    font-size: var(--font-size-24);
  }

  .error-fallback__message {
    font-size: var(--font-size-16);
  }

  .error-fallback__actions {
    flex-direction: column;
    width: 100%;
  }
}
</style>

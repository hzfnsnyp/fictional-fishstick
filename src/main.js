// FILE: src/main.js
import { createApp } from 'vue'
import { h } from 'vue'
import App from './App.vue'
import router from './router'
import ErrorFallback from './components/ui/ErrorFallback.vue'

// Import your design system styles
import './styles/main.css'
import 'focus-visible';

const app = createApp(App);

// ==============================================================================
// Global Error Handler
// ==============================================================================
// Catches all unhandled errors in Vue components
app.config.errorHandler = (err, instance, info) => {
  // Log error to console in development
  if (import.meta.env.DEV) {
    console.error('[Vue Error Handler]:', err);
    console.error('Component:', instance);
    console.error('Error info:', info);
  }

  // In production, you would send this to an error tracking service
  // Example: Sentry.captureException(err, { extra: { info, component: instance?.$options?.name } });

  // Log to console in production (can be disabled once error tracking is set up)
  if (import.meta.env.PROD) {
    console.error('An error occurred:', err.message);
  }

  // Mount error fallback UI for critical errors
  // This creates a full-screen error display
  const errorDiv = document.createElement('div');
  errorDiv.id = 'error-root';
  document.body.appendChild(errorDiv);

  createApp({
    render: () => h(ErrorFallback, {
      error: err,
      showDetails: import.meta.env.DEV // Only show details in development
    })
  }).mount('#error-root');
};

// ==============================================================================
// Global Warning Handler (Development Only)
// ==============================================================================
// Suppresses specific warnings if needed
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    // Log warnings in development
    console.warn('[Vue Warning]:', msg);
    console.warn('Trace:', trace);
  };
}

app.use(router);
app.mount('#app');

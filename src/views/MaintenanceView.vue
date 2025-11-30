<!-- FILE: src/views/MaintenanceView.vue -->
<!-- Maintenance Mode Page -->

<template>
  <main class="maintenance">
    <div class="maintenance__content">
      <h1 class="maintenance__title">Site Under Maintenance</h1>
      
      <div 
        v-if="status?.maintenanceMessage" 
        class="maintenance__message"
        v-html="status.maintenanceMessage"
      ></div>
      
      <p v-else class="maintenance__message">
        We're currently performing scheduled maintenance. We'll be back soon!
      </p>

      <p v-if="status?.contactEmail" class="maintenance__contact">
        For urgent inquiries, please contact
        <ClickableTextComponent
          action-type="external"
          :href="`mailto:${status.contactEmail}`"
          class="maintenance__email"
        >
          {{ status.contactEmail }}
        </ClickableTextComponent>
      </p>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import ClickableTextComponent from '@/components/ui/ClickableTextComponent.vue'
import { useSEO } from '@/composables/useSEO'
import { useGlobalStatus } from '@/composables/useSanity'

const { setSEO } = useSEO()
const { status, fetchStatus } = useGlobalStatus()

onMounted(async () => {
  setSEO({
    title: 'Site Maintenance',
    description: 'The site is currently under maintenance.',
    noindex: true
  })
  
  await fetchStatus()
})
</script>

<style scoped>
/* ==========================================================================
   MAINTENANCE PAGE STYLES
   ========================================================================== */

.maintenance {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-primary);
  padding: var(--spacing-48);
}

.maintenance__content {
  max-width: 600px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-20);
}

.maintenance__title {
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.maintenance__message {
  font-size: var(--font-size-18);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.maintenance__time {
  font-size: var(--font-size-16);
  color: var(--color-text-secondary);
  margin: 0;
}

.maintenance__time strong {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.maintenance__contact {
  margin: 0;
  padding-top: var(--spacing-16);
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-18);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .maintenance {
    padding: var(--spacing-32);
  }

  .maintenance__title {
    font-size: var(--font-size-24);
  }

  .maintenance__message {
    font-size: var(--font-size-16);
  }

  .maintenance__contact {
    font-size: var(--font-size-16);
  }
}
</style>

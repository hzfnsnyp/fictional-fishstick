// FILE: src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loaded views
const HomeView = () => import('../views/HomeView.vue')
const AboutView = () => import('../views/AboutView.vue')
const SeriesView = () => import('../views/SeriesView.vue')
const MediaView = () => import('../views/MediaView.vue')
const ArtworksView = () => import('../views/ArtworksView.vue')
const ExhibitionsView = () => import('../views/ExhibitionsView.vue')
const PrivacyPolicyView = () => import('../views/PrivacyPolicyView.vue')
const TermsOfUseView = () => import('../views/TermsOfUseView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')
const MaintenanceView = () => import('../views/MaintenanceView.vue')
const ErrorFallback = () => import('../components/ui/ErrorFallback.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/projects', name: 'projects', component: SeriesView },
    { path: '/series', redirect: { name: 'projects' } },
    { path: '/media', name: 'media', component: MediaView },
    { path: '/artworks', name: 'artworks', component: ArtworksView },
    { path: '/exhibitions', name: 'exhibitions', component: ExhibitionsView },
    { path: '/privacy-policy', name: 'privacy', component: PrivacyPolicyView },
    { path: '/terms-of-use', name: 'terms', component: TermsOfUseView },

    // 404 catch-all route (must be last)
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export default router

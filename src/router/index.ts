
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Define custom meta fields for routes
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

// Define routes with meta fields for authentication requirements
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }  // This route requires authentication
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')  // This is our login page
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }  // This route requires authentication
    }
  ]
})

// Navigation guard to check authentication before route changes
router.beforeEach(async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (to.query.auth_success) {
    try {
      await authStore.handleOAuthCallback()
      next({ name: 'dashboard', replace: true })
      return
    } catch (error) {
      console.error('OAuth callback failed:', error)
      next({ name: 'login', query: { error: 'auth_failed' }, replace: true })
      return
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    try {
      await authStore.fetchUser()
      next()
    } catch (error) {
      next('/login')
    }
  } else {
    next()
  }
})

export default router


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

   // Check if there's a token in the URL parameters
   const token = to.query.token as string
  
   if (token) {
     try {
       console.log('Processing OAuth token in navigation guard')
       // Process the token and wait for completion
       await authStore.handleOAuthCallback(token)
       console.log('OAuth callback completed, redirecting to dashboard')
       // Redirect to dashboard and clean up URL
       next({ name: 'dashboard', replace: true })
       return
     } catch (error) {
       console.error('OAuth callback failed:', error)
       // If OAuth fails, redirect to login with error
       next({ name: 'login', query: { error: 'auth_failed' }, replace: true })
       return
     }
   }
  
  // If route requires auth and user isn't authenticated, redirect to login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()  // Otherwise proceed normally
  }
})

export default router
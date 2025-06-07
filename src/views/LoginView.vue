<!-- src/views/LoginView.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to TaskFlow
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Manage your tasks and projects efficiently
          </p>
        </div>
        
        <!-- Loading indicator -->
        <div v-if="loading" class="flex justify-center">
          <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <!-- Error message -->
        <div v-if="error" class="bg-red-50 p-4 rounded-md text-red-600 text-sm">
          {{ error }}
        </div>
        
        <!-- OAuth buttons -->
        <div class="mt-8 space-y-4">
          <a
            :href="googleAuthUrl"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign in with Google
          </a>
          <a
            :href="githubAuthUrl"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Sign in with GitHub
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // API URLs for OAuth providers
  const apiBase = import.meta.env.VITE_API_BASE_URL
  const googleAuthUrl = computed(() => `${apiBase}/auth/google_oauth2`)
  const githubAuthUrl = computed(() => `${apiBase}/auth/github`)
  
  onMounted(async () => {
    console.log('LoginView mounted')
    console.log('Current URL:', window.location.href)
    console.log('Route query params:', route.query)
    
    // Check for token in URL (after OAuth redirect)
    const token = route.query.token as string | undefined
    console.log('Token found:', token)
    
    if (token) {
      console.log('Processing token...')
      loading.value = true
      error.value = null
      
      try {
        // Process the token and fetch user data
        console.log('Calling handleOAuthCallback')
        await authStore.handleOAuthCallback(token)
        console.log('Auth successful, redirecting to dashboard')
        router.push('/dashboard') // Redirect to dashboard on success
      } catch (err) {
        console.error('Full auth error:', err)
        error.value = 'Authentication failed. Please try again.'
      } finally {
        loading.value = false
      }
    } else {
      console.log('No token found in URL')
    }
  })
  </script>
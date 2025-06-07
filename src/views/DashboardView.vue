<!-- src/views/DashboardView.vue -->
<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Top Navigation -->
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold text-blue-600">TaskFlow</h1>
              </div>
            </div>
            <div class="flex items-center">
              <div class="ml-3 relative">
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-700">{{ user?.name || 'User' }}</span>
                  <button 
                    @click="logout" 
                    class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- Main Content -->
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-800">Welcome to your Dashboard</h2>
            <p class="mt-2 text-gray-600">
              Your projects and tasks will appear here soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  // Get user from the auth store
  const user = computed(() => authStore.user)
  
  // Handle logout
  const logout = () => {
    authStore.logout()
    router.push('/login')
  }
  
  // Fetch user data when component mounts
  onMounted(async () => {
    // Only fetch if we have a token but no user data
    if (authStore.token && !authStore.user) {
      try {
        await authStore.fetchUser()
      } catch (error) {
        console.error('Failed to load user data:', error)
        router.push('/login')
      }
    }
  })
  </script>
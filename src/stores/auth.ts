import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface User {
  id: number
  email: string
  name: string
  avatar_url?: string
  [key: string]: any
}

axios.defaults.withCredentials = true

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const setAuth = (userData: User | null) => {
    user.value = userData
  }

  const logout = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/logout`)
      user.value = null
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  // Fetch current user data from the API
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`)
      user.value = response.data.user
      return response.data.user
    } catch (error) {
      console.error('Error fetching user:', error)
      logout()
      throw error
    }
  }

  const handleOAuthCallback = async () => {
    setAuth(null)
    window.history.replaceState({}, document.title, window.location.pathname)
    return await fetchUser()
  }

  // Return the store's state and methods
  return {
    user,
    isAuthenticated,
    setAuth,
    logout,
    fetchUser,
    handleOAuthCallback
  }
})

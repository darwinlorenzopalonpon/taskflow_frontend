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

// Define the auth store using the Composition API style with Pinia
export const useAuthStore = defineStore('auth', () => {
  // Reactive state - user data and JWT token
  const user = ref<User | null>(null)  // Stores the current user's information
  const token = ref<string | null>(localStorage.getItem('auth_token'))  // Retrieve token from localStorage if it exists

  // Computed property to check if user is authenticated
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Set up axios interceptor for authenticated requests
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  // Store authentication data and configure axios
  const setAuth = (newToken: string, userData: User | null) => {
    console.log('Setting auth token:', newToken)
    token.value = newToken
    user.value = userData
    localStorage.setItem('auth_token', newToken)  // Persist token in localStorage
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`  // Set token in axios headers
  }

  // Clear authentication data and axios headers
  const logout = () => {
    console.log('Logging out')
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    delete axios.defaults.headers.common['Authorization']
  }

  // Fetch current user data from the API
  const fetchUser = async () => {
    console.log('Fetching user data')
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`)
      console.log('User data received:', response.data)
      user.value = response.data.user
      return response.data.user
    } catch (error) {
      console.error('Error fetching user:', error)
      logout()  // If API call fails, log the user out
      throw error
    }
  }

  // Handle OAuth callback with token from URL
  const handleOAuthCallback = async (tokenFromUrl: string) => {
    console.log('Handling OAuth callback with token:', tokenFromUrl)
    if (tokenFromUrl) {
      setAuth(tokenFromUrl, null)
      // Remove token from URL for security
      window.history.replaceState({}, document.title, window.location.pathname)
      // Make sure to await the fetchUser call
      return await fetchUser()
    }
  }

  // Return the store's state and methods
  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
    fetchUser,
    handleOAuthCallback
  }
})

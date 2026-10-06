import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    // A 401 from a login/register/me attempt is a normal "wrong credentials" case,
    // not a session expiry — don't trigger the global logout flow for those.
    const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/me')
    if (status === 401 && !isAuthAttempt) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)

export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.code === 'ERR_NETWORK') return 'Cannot reach the server. Check your connection.'
  return fallback
}

export default api
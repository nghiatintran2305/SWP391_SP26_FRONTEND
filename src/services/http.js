import axios from 'axios'
import { storage } from '../utils/storage'

const http = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})

http.interceptors.request.use((config) => {
  const token = storage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      storage.clear()
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  },
)

export default http
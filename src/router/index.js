import { createRouter, createWebHistory } from 'vue-router'

import Hero from '../components/Hero.vue'
import Login from '../components/Login.vue'
import Signup from '../components/Signup.vue'
import ForgotPassword from '../components/ForgotPassword.vue'
import ResetPassword from '../components/ResetPassword.vue'
import NewGenerator from '../components/NewGenerator.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Hero
  },

  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },

  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },

  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },

  {
    path: '/generator/new',
    name: 'NewGenerator',
    component: NewGenerator,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// Helper to check if token is expired or invalid
function isTokenExpired(token) {
  if (!token) return true
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return true
    }
    return false
  } catch (e) {
    return true
  }
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isExpired = isTokenExpired(token)

  if (to.meta.requiresAuth && isExpired) {
    if (token) {
      localStorage.removeItem('token')
    }
    next('/login')
  } else if ((to.name === 'Login' || to.name === 'Home') && !isExpired) {
    next('/generator/new')
  } else {
    next()
  }
})


export default router
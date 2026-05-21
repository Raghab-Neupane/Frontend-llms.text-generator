import { createRouter, createWebHistory } from 'vue-router'
import Hero from '../components/Hero.vue'
import Login from '../components/Login.vue'
import LLmsGenerator from '../components/LLms-generator.vue'
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
    path: '/generator',
    name: 'Generator',
    component: LLmsGenerator
  },
  {
    path: '/generator/new',
    name: 'NewGenerator',
    component: NewGenerator
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/createmovie',
    name: 'CreateMovie',
    component: () => import('../views/CreateMovie.vue')
  },
  {
    path: '/creategenre',
    name: 'CreateGenre',
    component: () => import('../views/CreateGenre.vue')
  },
  {
    path: '/createperson',
    name: 'CreatePerson',
    component: () => import('../views/CreatePerson.vue')
  },
  {
    path: '/movie/:title',
    name: 'MoviePage',
    component: () => import('../views/MoviePage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

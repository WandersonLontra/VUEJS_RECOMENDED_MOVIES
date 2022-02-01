import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
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

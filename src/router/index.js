import Vue from 'vue'
import VueRouter from 'vue-router'

import LogInView from '../views/LogInView.vue'
import PostsView from '../views/PostsView.vue'
import UsersView from '../views/UsersView.vue'
import PostsStateView1 from '../views/PostsStateView1'
import ErrorView from '../views/ErrorView'

import "@fontsource/montserrat"

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView,
  //   meta: {
  //     requiresAuth: true
  //   },
  // },
  {
    path: '/error',
    name: 'error',
    component: ErrorView
  },
  {
    path: '/login',
    name: 'login',
    component: LogInView
  },
  {
    path: '/posts',
    name: 'posts',
    component: PostsView,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: '/state_of_posts',
    name: 'postsstate',
    component: PostsStateView1,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth && route.meta.requiresAdmin)) {
    if (localStorage.getItem("token") && localStorage.getItem("isAdmin") === 'true') {     
      next()
    } else if (localStorage.getItem("token") && localStorage.getItem("isAdmin") === 'false') {
      next({name: 'posts'})
    } else {
      next({name: 'login'})
    }
  } else if (to.matched.some(route => route.meta.requiresAuth)){
    if (localStorage.getItem("token")) {
      next()
    } else {
      next({name: 'login'})
    }
  } else if (to.name == 'login' && localStorage.getItem("token")) {
    next({name: 'posts'})
  } else {
    next()
  }
})

export default router
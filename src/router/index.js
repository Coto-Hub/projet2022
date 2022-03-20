import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ClassView from '../views/ClassView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/classroom',
    name: 'ShowClassroom',
    component: ClassView,
  }
]

const router = new VueRouter({
  routes
})

export default router

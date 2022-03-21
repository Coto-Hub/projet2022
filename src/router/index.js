import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ClassView from '../views/ClassView.vue'
import OneClassView from '../views/OneClassView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/classrooms',
    name: 'ShowClassrooms',
    component: ClassView,
  },
  {
    path: '/classroom/:id',
    name: 'ShowOneClassroom',
    component: OneClassView,
  }
]

const router = new VueRouter({
  routes
})

export default router

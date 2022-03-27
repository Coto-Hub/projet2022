import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ClassView from '../views/ClassView.vue'
import OneClassView from '../views/OneClassView.vue'
import EvaluationView from '../views/EvaluationView.vue'
import OneEvaluationView from "../views/OneEvaluationView.vue";
import RateView from "../views/RateView.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
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
  },
  {
    path: '/evaluations',
    name: 'ShowEvaluations',
    component: EvaluationView
  },
  {
    path: '/evaluation/:id',
    name: 'ShowOneEvaluation',
    component: OneEvaluationView
  },
  {
    path: '/rate',
    name: 'Rate',
    component: RateView
  }
]

const router = new VueRouter({
  routes
})

export default router

<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/classroom">Classes</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import ShowClassroom from './components/ShowClassroom.vue'

export default {
  name: 'App',
  components: {
    ShowClassroom
  }
}
</script>

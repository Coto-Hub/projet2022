<template>
  <div id="app">
    <MainDisplay app-title="Evaluation">
      <font-awesome-icon icon="fa-solid fa-user-secret" />
    </MainDisplay>
  </div>
</template>

<script>
import MainDisplay from './components/MainDisplay.vue'

export default {
  name: 'App',
  components: {
    MainDisplay
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

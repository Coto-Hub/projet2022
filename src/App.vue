<template>
  <div id="app">
    <MainDisplay app-title="Evaluation">
      <img alt="Vue logo" src="./assets/logo.png">
      <HelloWorld msg="Welcome to Your Vue.js App"/>
      <font-awesome-icon icon="fa-solid fa-user-secret" />
    </MainDisplay>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import MainDisplay from './components/MainDisplay.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
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

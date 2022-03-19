<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <ShowClassroom msg="Hello Alexis"/>
    <font-awesome-icon icon="fa-solid fa-user-secret" />
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

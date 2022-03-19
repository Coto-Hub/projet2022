<template>
  <div id="app">
    <MainDisplay app-title="Evaluation">
      <ShowClassroom msg="Hello Alexis"/>
      <ShowEvaluation />
      <font-awesome-icon icon="fa-solid fa-user-secret" />
    </MainDisplay>
  </div>
</template>

<script>
import MainDisplay from './components/MainDisplay.vue'
import ShowClassroom from './components/ShowClassroom.vue'
import ShowEvaluation from './components/ShowEvaluations.vue'

export default {
  name: 'App',
  components: {
    MainDisplay,
    ShowClassroom,
    ShowEvaluation
  }
}
</script>

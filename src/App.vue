<template>
  <MainDisplay app-title="Evaluations">
    <div id="app">
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/classrooms">Classes</router-link> |
        <router-link to="/evaluations">Evaluations</router-link>
      </nav>
      <router-view/>
    </div>
  </MainDisplay>
</template>
<script>
import MainDisplay from "@/components/MainDisplay";
export default {
  components: {MainDisplay}
}
</script>
<template>
  <MainDisplay app-title="Evaluations">
    <div class="container" id="app">
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/classrooms">Group</router-link> |
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

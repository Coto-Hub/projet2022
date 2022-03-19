<template>
  <div class="home">
    <ShowClassroom/>
  </div>
</template>

<script>
// @ is an alias to /src
import ShowClassroom from '@/components/ShowClassroom.vue'

export default {
  name: 'ClassView',
  components: {
    ShowClassroom
  }
}
</script>

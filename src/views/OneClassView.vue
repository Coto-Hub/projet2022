<template>
  <div v-if="ready">
    <p>{{ id }}</p>
    <ul>
      <li v-for="student in students" :key="student.id_student">
        {{student.firstname}} {{student.lastname}}
      </li>
    </ul>
  </div>
</template>

<script>

import bd from '../script/bd'

export default {
  name: 'OneClassView',
  props: {},
  data: function () {
    return {
      db: null,
      id: null,
      ready:false,
      students: [],
    }
  },
  async created() {
    this.db = await bd.getDb();
    this.id = this.$route.params.id;
    //await bd.addStudentToDb(this.db, {id_class: this.id, firstname: "Thomas", lastname: "Marty"});
    this.students = await bd.getStudentOfClassFromDb(this.db, this.id);
    this.ready = true;
  },
  methods: {
  },
}
</script>

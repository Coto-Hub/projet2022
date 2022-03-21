<template>
  <div v-if="ready" class="show-classroom">
    <button @click="addClass" :disabled="addDisabled">Add Classroom</button>
    <ul>
      <li v-for="classroom in classrooms" :key="classroom.id">
        {{classroom.name}} <router-link :to="{ name: 'ShowOneClassroom', params: { id: classroom.id_class }}">Update</router-link>
      </li>
    </ul>
  </div>
</template>

<script>

import bd from '../script/bd'

export default {
  name: 'ClassView',
  props: {},
  data: function () {
    return {
      db: null,
      ready:false,
      addDisabled:false,
      classrooms:[]
    }
  },
  async created() {
    this.db = await bd.getDb();
    this.classrooms = await bd.getClassroomFromDb(this.db);
    this.ready = true;
  },
  methods: {
    async addClass() {
      this.addDisabled = true;
      // random cat for now
      let classroom = {
        name:"Class" + Math.floor(Math.random() * 100),
      };
      console.log('about to add '+JSON.stringify(classroom));
      await bd.addClassToDb(this.db, classroom);
      this.classrooms = await bd.getClassroomFromDb(this.db);
      this.addDisabled = false;
    },
    async deleteClass(id) {
      await bd.deleteClassFromDb(this.db, id);
      this.classrooms = await bd.getClassroomFromDb(this.db);
    },
  },
}
</script>

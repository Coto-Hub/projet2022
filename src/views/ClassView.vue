<template>
  <div v-if="ready" class="show-classroom">
    <button @click="addClass" :disabled="addDisabled">Add Classroom</button>
    <ul>
      <li v-for="classroom in classrooms" :key="classroom.id">
        {{classroom.name}} <button @click="deleteClass(classroom.id)">Update</button>
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
    this.classrooms = await this.getClassroomFromDb();
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
      await this.addClassToDb(classroom);
      this.classrooms = await this.getClassroomFromDb();
      this.addDisabled = false;
    },
    async deleteClass(id) {
      await this.deleteClassFromDb(id);
      this.classrooms = await this.getClassroomFromDb();
    },
    async addClassToDb(classroom) {
      return new Promise((resolve) => {

        let trans = this.db.transaction(['classroom'],'readwrite');
        trans.oncomplete = () => {
          resolve();
        };

        let store = trans.objectStore('classroom');
        store.add(classroom);

      });
    },
    async deleteClassFromDb(id) {
      return new Promise((resolve) => {
        let trans = this.db.transaction(['classroom'],'readwrite');
        trans.oncomplete = () => {
          resolve();
        };

        let store = trans.objectStore('classroom');
        store.delete(id);
      });
    },
    async getClassroomFromDb() {
      return new Promise((resolve) => {

        let trans = this.db.transaction(['classroom'],'readonly');
        trans.oncomplete = () => {
          resolve(classrooms);
        };

        let store = trans.objectStore('classroom');
        let classrooms = [];

        store.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            classrooms.push(cursor.value)
            cursor.continue();
          }
        };
      });
    },
  },
}
</script>

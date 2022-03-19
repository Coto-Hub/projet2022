<template>
  <div v-if="ready">
    <button @click="addEvaluation" :disabled="addDisabled">Add Evaluation</button>
    <p/>
    <ul>
      <li v-for="evaluation in evaluations" :key="evaluation.id">
        {{evaluation.name}} is {{evaluation.age}} years old. <button @click="deleteEval(evaluation.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ShowClassroom',
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
    this.db = await this.getDb();
    this.classrooms = await this.getEvaluationFromDb();
    this.ready = true;
  },
  methods: {
    async addEval() {
      this.addDisabled = true;
      // random cat for now
      let evaluation = {
        name:"Evaluation" + Math.floor(Math.random() * 100),
      };
      console.log('about to add '+JSON.stringify(evaluation));
      await this.addEvalToDb(evaluation);
      this.classrooms = await this.getEvaluationFromDb();
      this.addDisabled = false;
    },
    async deleteEval(id) {
      await this.deleteEvalFromDb(id);
      this.classrooms = await this.getEvaluationFromDb();
    },
    async addEvalToDb(evaluation) {
      return new Promise((resolve) => {

        let trans = this.db.transaction(['evaluation'],'readwrite');
        trans.oncomplete = () => {
          resolve();
        };

        let store = trans.objectStore('evaluation');
        store.add(evaluation);

      });
    },
    async deleteClassFromDb(id) {
      return new Promise((resolve) => {
        let trans = this.db.transaction(['evaluation'],'readwrite');
        trans.oncomplete = () => {
          resolve();
        };

        let store = trans.objectStore('evaluation');
        store.delete(id);
      });
    },
    async getClassroomFromDb() {
      return new Promise((resolve) => {

        let trans = this.db.transaction(['evaluation'],'readonly');
        trans.oncomplete = () => {
          resolve(evaluations);
        };

        let store = trans.objectStore('classroom');
        let evaluations = [];

        store.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            evaluations.push(cursor.value)
            cursor.continue();
          }
        };
      });
    },
    async getDb() {
      return new Promise((resolve, reject) => {

        let request = window.indexedDB.open('evaluationDB', 1);

        request.onerror = e => {
          console.log('Error opening db', e);
          reject('Error');
        };

        request.onsuccess = e => {
          resolve(e.target.result);
        };

        request.onupgradeneeded = e => {
          console.log('onupgradeneeded');
          let db = e.target.result;
          db.createObjectStore("classroom", { autoIncrement: true, keyPath:'id' });
        };
      });
    },
  },
}
</script>
<template>
  <BasicListDisplay :element-list="students" :ready="ready" :mutable-object="studentToAdd" :message-display-condition="showCondition">
    <template v-slot:element_update_display="slotProps">
      <div>
        <input type="text" v-model="slotProps.element.firstname" />
        <input type="text" v-model="slotProps.element.lastname" />
      </div>
      <div>
        <button @click="updateStudent(slotProps.element)" >Valider</button>
      </div>
    </template>
    <template v-slot:element_show_display="slotProps">
      <div>
        {{slotProps.element.firstname }} {{ slotProps.element.lastname }}
      </div>
      <div>
        <button @click="toggleUpdateStudent(slotProps.element)">Modifier</button>
      </div>
    </template>
    <template v-slot:input_field="slotProps">
      <input type="text" v-model="slotProps.mutable.firstname" /> <input type="text" v-model="slotProps.mutable.lastname" /> <button @click="addStudent" :disabled="addDisabled">Ajouter</button>
    </template>
  </BasicListDisplay>
</template>

<script>

import bd from '../script/bd'
import BasicListDisplay from "@/components/BasicListDisplay";
import Vue from "vue";

export default {
  name: 'OneClassView',
  components: {BasicListDisplay},
  props: {},
  data: function () {
    return {
      db: null,
      id: null,
      ready:false,
      addDisabled:false,
      students: [],
      studentToAdd : {
        firstname: "",
        lastname: "",
      }
    }
  },
  computed: {
    showCondition: function() {
      return (this.studentToAdd.firstname !== "" && this.studentToAdd.lastname !== "")
    }
  },
  async created() {
    this.db = await bd.getDb();
    this.id = this.$route.params.id;
    this.students = await bd.getStudentOfClassFromDb(this.db, this.id);
    this.ready = true;
  },
  methods: {
    toggleUpdateStudent(element) {
      let index = this.students.indexOf(element);
      if (index >= 0) {
        element.updated = !element.updated
        Vue.set(this.students, index, element)
      }
      return false;
    },
    async updateStudent(element) {
      this.toggleUpdateStudent(element);
      await bd.updateStudentToDb(this.db, element);
    },
    async addStudent() {
      if(this.studentToAdd.firstname !== "" && this.studentToAdd.lastname !== "") {
        this.addDisabled = true;
        let student = {
          id_class: this.id,
          firstname: this.studentToAdd.firstname,
          lastname: this.studentToAdd.lastname
        };
        console.log('about to add '+JSON.stringify(student));
        await bd.addStudentToDb(this.db, student);
        this.students = await bd.getStudentOfClassFromDb(this.db, this.id);
        this.studentToAdd.firstname = "";
        this.studentToAdd.lastname = "";
        this.addDisabled = false;
      }
    },
  },
}
</script>

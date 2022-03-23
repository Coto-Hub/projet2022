<template>
  <BasicListDisplay :element-list="students" :ready="ready" :mutable-object-add="studentToAdd" :mutable-object-update="nameToUpdate" :message-display-condition="showCondition">
    <template v-slot:element_display="slotProps">
      <div class="headearList">
        <input type="text" v-model="slotProps.mutable.name" /><a class="check" v-if="showUpdateClassName" @click="updateClassName" ><font-awesome-icon icon="fa-solid fa-circle-check" /></a>
      </div>
    </template>
    <template v-slot:element_update_display="slotProps">
      <div class="listItemLeft display-input">
        <input type="text" v-model="slotProps.element.firstname" />
        <input type="text" v-model="slotProps.element.lastname" />
      </div>
      <div class="listItemRight">
        <a class="check" @click="updateStudent(slotProps.element)" ><font-awesome-icon icon="fa-solid fa-circle-check" /></a>
        <a class="delete" @click="deleteStudent(slotProps.element)"><font-awesome-icon icon="fa-solid fa-trash" /></a>
      </div>
    </template>
    <template v-slot:element_show_display="slotProps">
      <div class="listItemLeft">
        {{slotProps.element.firstname }} {{ slotProps.element.lastname }}
      </div>
      <div class="listItemRight">
        <a class="update" @click="toggleUpdateStudent(slotProps.element)"><font-awesome-icon icon="fa-solid fa-pencil" /></a>
      </div>
    </template>
    <template v-slot:input_field="slotProps">
      <input type="text" v-model="slotProps.mutable.firstname" /> <input type="text" v-model="slotProps.mutable.lastname" /> <button class="mt-4" @click="addStudent" :disabled="addDisabled">Ajouter</button>
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
      defaultName: "",
      studentToAdd : {
        firstname: "",
        lastname: "",
      },
      nameToUpdate : {
        name: "",
      }
    }
  },
  computed: {
    showCondition: function() {
      return (this.studentToAdd.firstname !== "" && this.studentToAdd.lastname !== "")
    },
    showUpdateClassName: function() {
      return (this.defaultName !== this.nameToUpdate.name)
    }
  },
  async created() {
    this.db = await bd.getDb();
    this.id = this.$route.params.id;
    this.students = await bd.getStudentOfClassFromDb(this.db, this.id);
    this.nameToUpdate.name = await bd.getClassNameFromDb(this.db, this.id);
    this.defaultName = this.nameToUpdate.name;
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
    async updateClassName() {
      this.defaultName = this.nameToUpdate.name;
      await bd.updateClassToDb(this.db, {id_class: this.id, name: this.nameToUpdate.name});
    },
    async deleteStudent(element) {
      let index = this.students.indexOf(element);
      if (index >= 0) {
        element.updated = !element.updated
        Vue.delete(this.students, index)
      }
      await bd.deleteStudentToDb(this.db, element);
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

<template>
  <div>
    <BasicListDisplay :element-list="students" :ready="ready" :mutable-object-add="studentToAdd" :title="title" :mutable-object-update="nameToUpdate" :message-display-condition="showCondition">
      <template v-slot:element_display="slotProps">
        <div class="headerList">
          <div class="headerLeft">
            <input type="text" v-model="slotProps.mutable.name" />
            <a class="check" v-if="showUpdateClassName" @click="updateClassName" ><font-awesome-icon icon="fa-solid fa-circle-check" /></a>
            <a class="check disabled" v-else><font-awesome-icon icon="fa-solid fa-circle-check" /></a>
          </div>
          <div class="headerRight">
            <a @click="showImport = true" class="upload"><font-awesome-icon icon="fa-solid fa-upload" /></a>
            <a @click="showAlert = true" class="delete"><font-awesome-icon icon="fa-solid fa-trash" /></a>
          </div>
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
        <input placeholder="Prénom" type="text" v-model="slotProps.mutable.firstname" />
        <input placeholder="Nom" type="text" v-model="slotProps.mutable.lastname" />
        <button class="mt-4 btn add-button" @click="addStudent" :disabled="addDisabled">Ajouter</button>
      </template>
    </BasicListDisplay>
    <BasicAlertDisplay :ready="ready" v-if="showAlert" :is-little="true">
      <template v-slot:element_display>
        <h1>Alerte</h1>
        <p>Voulez-vous vraiment supprimer ce groupe ?</p>
      </template>
      <template v-slot:input_field>
        <button @click="deleteClass" class="btn delete-button" :disabled="deleteDisabled">Supprimer</button>
        <button @click="showAlert = false" class="btn cancel-button" :disabled="cancelDisabled">Annuler</button>
      </template>
    </BasicAlertDisplay>
    <BasicAlertDisplay :ready="ready" v-if="showImport" :message="'Veuillez renseigner un fichier .cvs'" :show-message="showError" :is-little="false">
      <template v-slot:element_display>
        <h1>Importer une liste</h1>
        <p>Selectionner un fichier</p>
        <input ref="file" type="file">
      </template>
      <template v-slot:input_field>
        <button @click="importStudent" class="btn add-button" :disabled="deleteDisabled">Ajouter</button>
        <button @click="showImport = false" class="btn cancel-button" :disabled="cancelDisabled">Annuler</button>
      </template>
    </BasicAlertDisplay>
  </div>
</template>

<script>

import bd from '../script/bd'
import BasicListDisplay from "@/components/BasicListDisplay";
import BasicAlertDisplay from "@/components/BasicAlertDisplay";
import Vue from "vue";

export default {
  name: 'OneClassView',
  components: {BasicAlertDisplay, BasicListDisplay},
  props: {},
  data: function () {
    return {
      title: "Gestion des groupes",
      db: null,
      id: null,
      ready:false,
      addDisabled:false,
      deleteDisabled: false,
      cancelDisabled: false,
      showAlert: false,
      showError: false,
      showImport: false,
      students: [],
      lignes: [],
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
    this.id = parseInt(this.$route.params.id);
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
    async importStudent() {
      let file = this.$refs.file.files[0];
      let id = this.id;
      let db = this.db;
      if (!file) {
        this.showError = true;
        return;
      }
      if (file.name.includes(".csv")) {
        await new Promise((resolve) => {
          let reader = new FileReader();
          reader.onload = async function (e) {
            let lignes = e.target.result.split("\n");
            console.log(e);
            for (const ligne of lignes) {
              let values = ligne.trim().split(";");
              console.log(values);
              if (values.length === 2) {
                let student = {
                  id_class: id,
                  firstname: values[0],
                  lastname: values[1],
                };
                await bd.addStudentToDb(db, student);
              }
            }
            resolve();
          }
          reader.readAsText(file);
        });
        this.students = await bd.getStudentOfClassFromDb(this.db, this.id);
        this.addDisabled = false;
      } else {
        this.showError = true;
      }
      this.showImport = false;
    },
    async updateStudent(element) {
      this.toggleUpdateStudent(element);
      await bd.updateStudentToDb(this.db, element);
    },
    async deleteClass() {
      await bd.deleteClassFromDb(this.db, this.id);
      this.$router.push({ name: "ShowClassrooms"})
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

<template>
  <BasicListDisplay v-bind:title="title" :element-list="classrooms" :ready="ready" :mutable-object-add="studentToAdd" :message-display-condition="showCondition" :element-list-left="'Nom du groupe'" :element-list-right="'Intéraction'">
    <template v-slot:element_show_display="slotProps">
      <div class="listItemLeft">
        {{slotProps.element.name }}
      </div>
      <div class="listItemRight">
        <router-link :to="{ name: 'ShowOneClassroom', params: { id: slotProps.element.id_class }}"><font-awesome-icon icon="fa-solid fa-pencil" /></router-link>
      </div>
    </template>
    <template v-slot:input_field="slotProps">
      <input placeholder="Nom du groupe" type="text" v-model="slotProps.mutable.name" />
      <button @click="addClass" :disabled="addDisabled" class="btn add-button">Ajouter</button>
    </template>
  </BasicListDisplay>
</template>

<script>

import bd from '../script/bd'
import BasicListDisplay from "@/components/BasicListDisplay";


export default {
  name: 'ClassView',
  components: {BasicListDisplay},
  props: {},
  data: function () {
    return {
      title: "Gestion des groupes",
      db: null,
      ready:false,
      addDisabled:false,
      classrooms:[],
      studentToAdd : {
        name: "",
      }
    }
  },
  async created() {
    this.db = await bd.getDb();
    this.classrooms = await bd.getClassroomFromDb(this.db);
    this.ready = true;
  },
  computed: {
    showCondition: function() {
      return this.studentToAdd.name !== ""
    }
  },
  methods: {
    async addClass() {
      this.addDisabled = true;
      let classroom = {
        name: this.studentToAdd.name,
      };
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

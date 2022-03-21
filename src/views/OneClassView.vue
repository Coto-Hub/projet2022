<template>
  <BasicListDisplay :element-list="students" :ready="ready" :mutable-object="studentToAdd" :message-display-condition="showCondition">
    <template v-slot:element_display="slotProps">
      <div>
        <div>
          <input type="text" v-model="slotProps.element.firstname" />
          <input type="text" v-model="slotProps.element.lastname" />
        </div>
        <div>
          <button @click="showUpdateStudent()" >Valider</button>
        </div>
      </div>
      <div>
        <div>
          {{slotProps.element.firstname }} {{ slotProps.element.lastname }}
        </div>
        <div>
          <button @click="showUpdateStudent(slotProps.element)">Modifier</button>
        </div>
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
    },
    showUpdate: function(element) {
      console.log(element)
      return element.modified;
    }
  },
  async created() {
    this.db = await bd.getDb();
    this.id = this.$route.params.id;
    this.students = await bd.getStudentOfClassFromDb(this.db, this.id);
    this.students.forEach(element => element.modified = false);
    this.ready = true;
  },
  methods: {
    showUpdateStudent(element) {
      this.students.forEach((student) => {
        if (student.id === element.id) {
          student.modified = true;
          element.modified = true;
        }
      });
      return false;
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

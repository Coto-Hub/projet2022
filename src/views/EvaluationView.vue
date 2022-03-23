<template>
  <BasicListDisplay :element-list="evaluations" :ready="ready" :mutable-object-add="evaluationToAdd" :message-display-condition="showCondition">
    <template v-slot:element_show_display="slotProps">
      <div class="listItemLeft">
        {{slotProps.element.name }}
      </div>
      <div class="listItemRight">
        <router-link :to="{ name: 'ShowOneEvaluation', params: { id: slotProps.element.id_eval }}"><font-awesome-icon icon="fa-solid fa-pencil" /></router-link>
      </div>
    </template>
    <template v-slot:input_field="slotProps">
      <input type="text" v-model="slotProps.mutable.name" /> <button @click="addEvaluation" :disabled="addDisabled">Ajouter</button>
    </template>
    <template v-slot:element_update_display="slotProps">
      <div class="listItemLeft display-input">
        <input type="text" v-model="slotProps.element.firstname" />
        <input type="text" v-model="slotProps.element.lastname" />
      </div>
      <div class="listItemRight">
        <a class="check" @click="updateCriteria(slotProps.element)" ><font-awesome-icon icon="fa-solid fa-circle-check" /></a>
        <a class="delete" @click="deleteCriteria(slotProps.element)"><font-awesome-icon icon="fa-solid fa-trash" /></a>
      </div>
    </template>
  </BasicListDisplay>
</template>

<script>

import bd from '../script/bd'
import BasicListDisplay from "@/components/BasicListDisplay";

export default {
  name: "EvaluationView",
  components: {BasicListDisplay},
  props: {},
  data: function () {
    return {
      db: null,
      ready:false,
      addDisabled:false,
      evaluations:[],
      evaluationToAdd: {
        name: "",
      }
    }
  },
  computed: {
    showCondition: function() {
      return this.evaluationToAdd.name !== ""
    }
  },
  async created() {
    this.db = await bd.getDb();
    this.evaluations = await bd.getEvaluationFromDb(this.db);
    this.ready = true;
  },
  methods: {
    async addEvaluation() {
      if(this.evaluationToAdd.name !== "") {
        this.addDisabled = true;
        let evaluation = {
          name: this.evaluationToAdd.name
        };
        console.log('about to add '+JSON.stringify(evaluation));
        await bd.addEvalToDb(this.db, evaluation);
        this.evaluations = await bd.getEvaluationFromDb(this.db);
        this.evaluationToAdd.name = "";
        this.addDisabled = false;
      }
    },
    async deleteEvaluation(id) {
      await bd.deleteEvalFromDb(this.db, id);
      this.evaluations = await bd.getEvaluationFromDb(this.db);
    },
  },
}
</script>

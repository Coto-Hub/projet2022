<template>
  <BasicListDisplay :element-list="criterias" :ready="ready" :mutable-object-add="criteriaToAdd" :message-display-condition="bool">
    <template v-slot:input_field="slotProps">
      <input type="text" v-model="slotProps.mutable.name_crit" /> <button @click="addCriteria" :disabled="addDisabled">Ajouter le critère</button>
    </template>
    <template v-slot:element_update_display="slotProps">
      <div class="listItemLeft display-input">
        <input type="text" v-model="slotProps.element.name_crit" />
      </div>
      <div class="listItemRight">
        <a class="check" @click="updateCriteria(slotProps.element)" ><font-awesome-icon icon="fa-solid fa-circle-check" /></a>
        <a class="delete" @click="deleteCriteria(slotProps.element)"><font-awesome-icon icon="fa-solid fa-trash" /></a>
      </div>
    </template>
    <template v-slot:element_show_display="slotProps">
      <div class="listItemLeft">
        {{slotProps.element.name_crit}}
      </div>
      <div class="listItemRight">
        <a class="update" @click="toggleUpdateCriteria(slotProps.element)"><font-awesome-icon icon="fa-solid fa-pencil" /></a>
      </div>
    </template>
  </BasicListDisplay>
</template>

<script>
import bd from '../script/bd'
import BasicListDisplay from "@/components/BasicListDisplay";
import Vue from "vue";


export default {
  name: "OneEvaluationView",
  components: {BasicListDisplay},
  props: {},
  data: function () {
    return {
      db: null,
      id: null,
      ready:false,
      addDisabled:false,
      criterias:[],
      criteriaToAdd : {
        name_crit: "",
      }
    }
  },
  computed: {
    bool: function() {
      return this.criteriaToAdd.name_crit !== ""
    }
  },
  async created() {
    this.db = await bd.getDb();
    this.id = this.$route.params.id;
    this.criterias = await bd.getCriteriasFromDb(this.db, this.id);
    this.ready = true;
  },
  methods: {
    toggleUpdateCriteria(element) {
      let index = this.criterias.indexOf(element);
      if (index >= 0) {
        element.updated = !element.updated
        Vue.set(this.criterias, index, element)
      }
      return false;
    },
    async updateCriteria(element) {
      this.toggleUpdateCriteria(element);
      await bd.updateCriteriaToDb(this.db, element);
    },
    async deleteCriteria(element) {
      let index = this.criterias.indexOf(element);
      if (index >= 0) {
        element.updated = !element.updated
        Vue.delete(this.criterias, index)
      }
      await bd.deleteCriteriaToDb(this.db, element);
    },
    async addCriteria() {
      if(this.criteriaToAdd.name_crit !== "") {
        this.addDisabled = true;
        let criteria = {
          id_eval: this.id,
          name_crit: this.criteriaToAdd.name_crit
        };
        console.log('about to add '+JSON.stringify(criteria));
        await bd.addCriteriaToDb(this.db, criteria);
        this.criterias = await bd.getCriteriasFromDb(this.db, this.id);
        this.criteriaToAdd.name_crit = "";
        this.addDisabled = false;
      }
    },
  },

}
</script>
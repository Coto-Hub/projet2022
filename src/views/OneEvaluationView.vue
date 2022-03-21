<template>
  <BasicListDisplay :element-list="criterias" :ready="ready" :mutable-object="criteriaToAdd" :message-display-condition="bool">
    <template v-slot:input_field="slotProps">
      <input type="text" v-model="slotProps.mutable.name_crit" /> <button @click="addCriteria" :disabled="addDisabled">Ajouter le critère</button>
    </template>
    <template v-slot:element_display="slotProps">
      {{slotProps.element.name_crit}} <!-- TODO: Modification du critère -->
    </template>
  </BasicListDisplay>
</template>

<script>
import bd from '../script/bd'
import BasicListDisplay from "@/components/BasicListDisplay";


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
<template>
  <div v-if="ready">
    <div  v-if="currently_rating[0] != null">
      <h2>
        Entrain de noter le groupe "{{ groupName }}" sur l'évaluation "{{ evalName }}"
      </h2>
      <!-- TODO: Permettre de changer le couple groupe-evaluation (en le suprimant, pas d'update) -->
      <BasicListDisplay :element-list="students" :ready="ready" :message-display-condition="true">
        <template v-slot:element_show_display="slotProps">
          <div class="listItemLeft">
            {{slotProps.element.firstname }} {{ slotProps.element.lastname }}
          </div>
          <div class="listItemRight">
            <!-- TODO: tableaux avec les critères (autre élément?) -->
          </div>
        </template>
      </BasicListDisplay>
    </div>
    <div v-else>
      <h2>Choisissez une évaluation et un groupe</h2>
      <p v-if="evaluations.length === 0">Aucune évaluation, veuillez en créer une </p>
      <label v-else>Evaluations : <select v-model="selectedEval">
        <option v-for="element in evaluations" :key="element.id" :value="element.id_eval">{{ element.name }}</option>
      </select></label>
      <p v-if="groups.length === 0">Aucun groupe, veuillez en créer un </p>
      <label v-else>Groupe :<select v-model="selectedGroup">
        <option v-for="element in groups" :key="element.id" :value="element.id_class">{{ element.name }}</option>
      </select></label>
      <button class="mt-4 btn add-button" @click="addCurrentlyRating" :disabled="addDisabled">Valider</button>
    </div>
  </div>
</template>

<script>
import bd from "@/script/bd";
import BasicListDisplay from "@/components/BasicListDisplay";

export default {
  name: "RateView",
  components: {BasicListDisplay},
  data: function () {
    return {
      db: null,
      ready:false,
      addDisabled: false,
      currently_rating:[],
      evaluations: [],
      groups: [],
      selectedGroup: "",
      selectedEval: "",
      evalName: "",
      groupName: "",
      students: [],
      criterias: [],
    }
  },
  async created() {
    this.db = await bd.getDb();
    this.currently_rating = await bd.getCurrentlyRatingFromDb(this.db);
    if(this.currently_rating.length === 0) {
      this.evaluations = await bd.getEvaluationFromDb(this.db);
      this.groups = await bd.getClassroomFromDb(this.db);
    } else {
      this.evalName = await bd.getEvaluationNameFromDb(this.db, this.currently_rating[0].id_eval)
      this.groupName = await bd.getClassNameFromDb(this.db, this.currently_rating[0].id_class)
      this.students = await bd.getStudentOfClassFromDb(this.db, this.currently_rating[0].id_class)
      this.criterias = await bd.getCriteriasFromDb(this.db, this.currently_rating[0].id_eval)
    }

    this.ready = true;
  },
  methods: {
    addCurrentlyRating: async function () {
      if(this.selectedEval !== "" && this.selectedGroup !== "") {
        this.addDisabled = true;
        let currentlyRated = {
          id_class: this.selectedGroup,
          id_eval: this.selectedEval,
        };
        console.log('about to add '+JSON.stringify(currentlyRated));
        await bd.addCurrentlyRatedtToDb(this.db, currentlyRated);
        this.currently_rating = await bd.getCurrentlyRatingFromDb(this.db, this.id);
        this.addDisabled = false;
      }
    }
  }
}
</script>

<style scoped>

</style>
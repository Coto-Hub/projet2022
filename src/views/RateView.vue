<template>
  <div v-if="ready">
    <div  v-if="currently_rating[0] != null">
      <h2>
        Entrain de noter le groupe "{{ groupName }}" sur l'évaluation "{{ evalName }}"
      </h2>
      <button @click="deleteCurrentlyRating">Changer de groupe et/ou d'évaluation</button>
      <BasicAlertDisplay :ready="ready" v-if="showAlert">
        <template v-slot:element_display>
          <h1>Entrain d'évaluer XX XX</h1>
          <label v-for="crit in criterias" :key="crit.id"> {{ crit.name_crit }} <input type="range" min="0" max="100"></label>
        </template>
        <template v-slot:input_field>
          <button class="btn add-button">Valider</button>
          <button @click="showAlert = false" class="btn cancel-button">Annuler</button>
        </template>
      </BasicAlertDisplay>
      <BasicListDisplay :element-list="students" :ready="ready" :message-display-condition="true" v-else>
        <template v-slot:element_show_display="slotProps">
          <div class="oneLine" @click="rateStudent(slotProps.element.id_student)">
            <div class="listItemLeft">
              {{slotProps.element.firstname }} {{ slotProps.element.lastname }}
            </div>
            <div class="listItemRight">
              <table class="rating_quick_view">
                <tr>
                  <th v-for="crit in criterias" :key="crit.id">
                    {{ crit.name_crit }}
                  </th>
                </tr>
                <tr>
                  <td v-for="crit in criterias" :key="crit.id">
                    50% <!-- TODO: ne pas mettre en dur -->
                  </td>
                </tr>
              </table>
            </div>
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
import BasicAlertDisplay from "@/components/BasicAlertDisplay";

export default {
  name: "RateView",
  components: {BasicAlertDisplay, BasicListDisplay},
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
      showAlert: false,
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
    rateStudent: function (id_student) {
      console.log(id_student)
      this.showAlert = true;
    },
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
        this.evalName = await bd.getEvaluationNameFromDb(this.db, this.currently_rating[0].id_eval)
        this.groupName = await bd.getClassNameFromDb(this.db, this.currently_rating[0].id_class)
        this.students = await bd.getStudentOfClassFromDb(this.db, this.currently_rating[0].id_class)
        this.criterias = await bd.getCriteriasFromDb(this.db, this.currently_rating[0].id_eval)
        this.addDisabled = false;
      }
    },
    deleteCurrentlyRating: async function() {
      await bd.deleteCurrentlyRatingToDb(this.db, this.currently_rating[0])
      this.currently_rating = await bd.getCurrentlyRatingFromDb(this.db, this.id);
      this.evaluations = await bd.getEvaluationFromDb(this.db);
      this.groups = await bd.getClassroomFromDb(this.db);
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <div v-if="ready">
    <div  v-if="currently_rating[0] != null">
      <BasicListDisplay :element-list="students" :ready="ready" :message-display-condition="true" :title="title" :element-list-left="'Élève'" :element-list-right="'Moyenne'">
        <template v-slot:element_display>
          <div class="headerList">
            <div class="headerCenter">
              <button class="btn" @click="deleteCurrentlyRating">Changer de groupe et/ou d'évaluation</button>
              <p>Moyenne général : {{ moyenneG }}%</p>
              <p>Ecart type général : {{ ecartG }}</p>
            </div>
            <div class="headerLeft">
              <p>Moyenne min : {{ minG }}%</p>
            </div>
            <div class="headerRight">
              <p>Moyenne max : {{ maxG }}%</p>
            </div>
          </div>
        </template>
        <template v-slot:element_show_display="slotProps">
          <div class="oneLine" @click="rateStudent(slotProps.element.id_student)">
            <div class="listItemLeft" :class="(slotProps.element.isComplet ? '' : 'red')">
              {{slotProps.element.firstname }} {{ slotProps.element.lastname }}
            </div>
            <div class="listItemRight">
              <p>{{ slotProps.element.avg }}%</p>
            </div>
          </div>
        </template>
        <template v-slot:input_field>
          <button @click="deleteAllRating" class="btn mt-4 delete-button">Réinitialiser</button>
        </template>
      </BasicListDisplay>
      <BasicAlertDisplay :ready="ready" v-if="showAlert">
        <template v-slot:element_display>
          <h2>Entrain d'évaluer {{ currentStudent.firstname }} {{ currentStudent.lastname }}</h2>
          <p>Moyenne : {{ currentStudent.avg }}%</p>
          <div class="listRating">
            <div class="w-full" v-for="crit in criterias" :key="crit.id">
              <table class="rating">
                <tr>
                  <td class="title" colspan="4" :class="crit.class">{{ crit.name_crit }}</td>
                </tr>
                <tr class="inputRate">
                  <td colspan="4">
                    <div class="slider">
                      <button @click="changeScore(crit.id_crit, -1)" class="btnSlider"><font-awesome-icon icon="fa-solid fa-minus" /></button>
                      <span>{{ crit.score }}%</span>
                      <button @click="changeScore(crit.id_crit, 1)" class="btnSlider"><font-awesome-icon icon="fa-solid fa-plus" /></button>
                    </div>
                    <input type="range" min="0" max="100" v-model="sliderVal[crit.id_crit]" @change="changeScore(crit.id_crit, 0)">
                  </td>
                </tr>
                <tr class="infoCrit">
                  <td @click="simpleAlert('Pourcentage minimum du groupe')">{{ crit.min }}%</td>
                  <td @click="simpleAlert('Pourcentage maximum du groupe')">{{ crit.max }}%</td>
                  <td @click="simpleAlert('Moyenne du groupe')">{{ crit.avg }}%</td>
                  <td @click="simpleAlert('Ecart type')">{{ crit.ecart }}</td>
                </tr>
              </table>
            </div>
          </div>
        </template>
        <template v-slot:input_field>
          <button @click="updateScore" class="btn add-button">Valider</button>
          <button @click="showAlert = false" class="btn cancel-button">Annuler</button>
          <button @click="deleteStudentRating(currentStudent.id_student)" class="btn mt-4 delete-button">Réinitialiser</button>
        </template>
      </BasicAlertDisplay>
      <BasicAlertDisplay :ready="ready" v-if="showSimpleAlert" :is-little="true">
        <template v-slot:element_display>
          <h1>Information</h1>
          <p>{{ simpleMsg }}</p>
        </template>
        <template v-slot:input_field>
          <button @click="showSimpleAlert = false" class="btn cancel-button">Annuler</button>
        </template>
      </BasicAlertDisplay>
    </div>
    <div class="basicDisplay" v-else>
      <div class="basicCenter choice">
        <h2>Choisissez une évaluation et un groupe</h2>
        <p v-if="evaluations.length === 0">Aucune évaluation, veuillez en créer une </p>
        <label v-else><span>Evaluations :</span>
          <select v-model="selectedEval">
            <option v-for="element in evaluations" :key="element.id" :value="element.id_eval">{{ element.name }}</option>
          </select>
        </label>
        <p v-if="groups.length === 0">Aucun groupe, veuillez en créer un </p>
        <label v-else><span>Groupe :</span>
          <select v-model="selectedGroup">
            <option v-for="element in groups" :key="element.id" :value="element.id_class">{{ element.name }}</option>
          </select>
        </label>
        <button class="mt-4 btn add-button" @click="addCurrentlyRating" :disabled="addDisabled">Valider</button>
      </div>
    </div>
  </div>
</template>

<script>
import bd from "@/script/bd";
import BasicListDisplay from "@/components/BasicListDisplay";
import BasicAlertDisplay from "@/components/BasicAlertDisplay";
import Vue from "vue";

export default {
  name: "RateView",
  components: {BasicAlertDisplay, BasicListDisplay},
  data: function () {
    return {
      id_student: 0,
      title: "",
      moyenneG: 0,
      minG: 0,
      maxG: 0,
      ecartG: 0,
      db: null,
      ready:false,
      addDisabled: false,
      currentStudent: null,
      currently_rating:[],
      evaluations: [],
      groups: [],
      selectedGroup: "",
      selectedEval: "",
      evalName: "",
      groupName: "",
      sliderVal: [],
      students: [],
      criterias: [],
      showAlert: false,
      showSimpleAlert: false,
      simpleMsg: "",
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
      await this.updateInfoOfStudent();
      await this.updateRatingInfo();
    }
    this.title = "Entrain de noter le groupe " + this.groupName + " sur l'évaluation" + this.evalName;
    this.ready = true;
  },
  methods: {
    async updateInfoOfStudent() {
      let sum = 0;
      let nb = 0;
      let avg = [];
      for (let student of this.students) {
        let index = this.students.indexOf(student);
        student.avg = await bd.getAvgStudent(this.db, student.id_student);
        student.isComplet = await bd.isCompletRatingStudent(this.db, student.id_student, this.currently_rating[0].id_eval);
        Vue.set(this.students, index, student);
        if (!isNaN(student.avg)) {
          avg.push(student.avg);
          sum += student.avg;
          nb++;
        }
      }

      if (avg.length !== 0) {
        this.moyenneG = (sum/nb).toFixed(2);
        this.minG = Math.min.apply(Math, avg).toFixed(2);
        this.maxG = Math.max.apply(Math, avg).toFixed(2);

        let value = 0;
        avg.forEach((rate) => {
          value += Math.pow((parseInt(rate) - this.moyenneG), 2);
        });
        this.ecartG = Math.pow(value/nb, 0.5).toFixed(2);
      }
      else {
        this.minG = "--";
        this.maxG = "--";
        this.moyenneG = "--";
        this.ecartG = "--";
      }
      if (avg.length === 1) {
        this.ecartG = "--";
      }
    },
    async deleteStudentRating(id_student) {
      await bd.deleteRatingOfStudent(this.db, id_student);
      await this.updateInfoOfStudent();
      await this.updateRatingInfo();
      this.showAlert = false;
    },
    async updateRatingInfo() {
      for (let criteria of this.criterias) {
        let index = this.criterias.indexOf(criteria);
        let ratings = await bd.getRatingFromDb(this.db, this.currently_rating[0].id_class, criteria.id_crit, this.id_student);
        if (ratings.length === 0 && criteria.score === "--") {
          criteria.min = "--";
          criteria.max = "--";
          criteria.avg = "--";
          criteria.ecart = "--";
        }
        else {
          if (!isNaN(parseInt(criteria.score))) {
            ratings.push(parseInt(criteria.score));
          }
          if (ratings.length !== 0) {
            criteria.min = Math.min.apply(Math, ratings).toFixed(2);
            criteria.max = Math.max.apply(Math, ratings).toFixed(2);

            let sum = 0;
            let nb = 0;
            ratings.forEach((rate) => {
              sum += rate;
              nb++;
            });
            criteria.avg = (sum/nb).toFixed(2);

            let value = 0;
            ratings.forEach((rate) => {
              value += Math.pow((parseInt(rate) - criteria.avg), 2);
            });
            criteria.ecart = Math.pow(value/nb, 0.5).toFixed(2);
          }
          else {
            criteria.min = "--";
            criteria.max = "--";
            criteria.avg = "--";
            criteria.ecart = "--";
          }

          if (ratings.length === 1) {
            criteria.ecart = "--";
          }
        }

        Vue.set(this.criterias, index, criteria);
      }
    },
    async updateScore() {
      for (let criteria of this.criterias) {
        if (criteria.isUpdate === true) {
          console.log(criteria);
          let rating = {
            id_crit: parseInt(criteria.id_crit),
            id_student: parseInt(this.id_student),
            score: parseInt(criteria.score),
          };
          await bd.updateRatingToDb(this.db, rating);
        }
      }
      await this.updateInfoOfStudent();
      await this.updateRatingInfo();
      this.showAlert = false;
    },
    async deleteAllRating() {
      for (let student of this.students) {
        await bd.deleteRatingOfStudent(this.db, student.id_student);
      }
      await this.updateInfoOfStudent();
      await this.updateRatingInfo();
    },
    simpleAlert(msg) {
      this.simpleMsg = msg;
      this.showSimpleAlert = true;
    },
    async changeScore(id_crit, value) {
      this.$emit('changeFoo', this.sliderVal);
      let sum = 0;
      let nb = 0;
      this.criterias.forEach((criteria, index) => {
        if (criteria.id_crit === id_crit) {
          this.sliderVal[id_crit] = parseInt(this.sliderVal[id_crit]) + value;
          criteria.score = parseInt(this.sliderVal[id_crit]);
          criteria.isUpdate = true;
          criteria.class = "orange";
          Vue.set(this.criterias, index, criteria);
        }
        if (!isNaN(criteria.score)) {
          sum += criteria.score;
          nb++;
        }
      });
      this.currentStudent.avg = isNaN(sum/nb) ? "--" : sum/nb;
      await this.updateRatingInfo();
    },
    rateStudent: async function (id_student) {
      this.id_student = id_student;
      this.currentStudent = await bd.getStudentFromDb(this.db, id_student);
      let sum = 0;
      let nb = 0;
      for (const criteria of this.criterias) {
        let rate = await bd.getRatingOfStudentFromDb(this.db, id_student, criteria.id_crit);
        if (rate.length === 0) {
          criteria.score = "--";
          criteria.class = "red";
          Vue.set(this.sliderVal, criteria.id_crit, 50);
        }
        else {
          criteria.id_student = id_student;
          criteria.score = rate[0].score;
          criteria.class = "green";
          Vue.set(this.sliderVal, criteria.id_crit, criteria.score);
          sum += rate[0].score;
          nb++;
        }
        criteria.isUpdate = false;
      }
      this.currentStudent.avg = isNaN(sum/nb) ? "--" : sum/nb;

      await this.updateRatingInfo();
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
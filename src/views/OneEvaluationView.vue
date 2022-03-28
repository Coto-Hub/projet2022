<template>
  <div>
    <BasicListDisplay :element-list="criterias" :ready="ready" :mutable-object-add="criteriaToAdd" :title="title" :mutable-object-update="nameToUpdate" :message-display-condition="showCondition" :element-list-left="'Nom du critére'" :element-list-right="'Intéraction'">
      <template v-slot:element_display="slotProps">
        <div class="headerList">
          <div class="headerLeft">
            <input type="text" v-model="slotProps.mutable.name" />
            <a class="check" v-if="showUpdateEvalName" @click="updateEvalName" ><font-awesome-icon icon="fa-solid fa-circle-check" /></a>
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
          <input type="text" v-model="slotProps.element.name_crit" />
        </div>
        <div class="listItemRight">
          <a class="check" @click="updateCriteria(slotProps.element)" ><font-awesome-icon icon="fa-solid fa-circle-check" /></a>
          <a class="delete" @click="deleteCriteria(slotProps.element)"><font-awesome-icon icon="fa-solid fa-trash" /></a>
        </div>
      </template>
      <template v-slot:element_show_display="slotProps">
        <div class="listItemLeft">
          {{slotProps.element.name_crit }}
        </div>
        <div class="listItemRight">
          <a class="update" @click="toggleUpdateCriteria(slotProps.element)"><font-awesome-icon icon="fa-solid fa-pencil" /></a>
        </div>
      </template>
      <template v-slot:input_field="slotProps">
        <input placeholder="Nom du critére" type="text" v-model="slotProps.mutable.name_crit" />
        <button class="btn add-button" @click="addCriteria" :disabled="addDisabled">Ajouter</button>
      </template>
    </BasicListDisplay>
    <BasicAlertDisplay :ready="ready" v-if="showAlert" :is-little="true">
      <template v-slot:element_display>
        <h1>Alerte</h1>
        <p>Voulez-vous vraiment supprimer cette évaluation ?</p>
      </template>
      <template v-slot:input_field>
        <button @click="deleteEval" class="btn delete-button" :disabled="deleteDisabled">Supprimer</button>
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
        <button @click="importCriteria" class="btn add-button" :disabled="deleteDisabled">Ajouter</button>
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
  name: "OneEvaluationView",
  components: {BasicAlertDisplay, BasicListDisplay},
  props: {},
  data: function () {
    return {
      title: "Gestion des critéres",
      db: null,
      id: null,
      ready:false,
      addDisabled:false,
      deleteDisabled:false,
      cancelDisabled:false,
      showAlert: false,
      showError: false,
      showImport: false,
      criterias:[],
      defaultName: "",
      criteriaToAdd : {
        name_crit: "",
      },
      nameToUpdate : {
        name: "",
      }
    }
  },
  computed: {
    showCondition: function() {
      return this.criteriaToAdd.name_crit !== ""
    },
    showUpdateEvalName: function() {
      return (this.defaultName !== this.nameToUpdate.name)
    }
  },
  async created() {
    this.db = await bd.getDb();
    this.id = parseInt(this.$route.params.id);
    this.criterias = await bd.getCriteriasFromDb(this.db, this.id);
    this.nameToUpdate.name = await bd.getEvaluationNameFromDb(this.db, this.id);
    this.defaultName = this.nameToUpdate.name;
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
    async deleteEval() {
      let currently_rating = await bd.getCurrentlyRatingFromDb(this.db);
      if (currently_rating.length !== 0) {
        if (currently_rating[0].id_eval === this.id) {
          await bd.deleteCurrentlyRatingToDb(this.db, currently_rating[0])
        }
      }
      await bd.deleteEvalFromDb(this.db, this.id);
      this.$router.push({ name: "ShowEvaluations"})
    },
    async updateEvalName() {
      this.defaultName = this.nameToUpdate.name;
      await bd.updateEvalToDb(this.db, {id_eval: this.id, name: this.nameToUpdate.name});
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
    async importCriteria() {
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
            for (const ligne of lignes) {
              let values = ligne.trim().split(";");
              if (values.length === 1) {
                let criteria = {
                  id_eval: id,
                  name: values[0],
                };
                await bd.addCriteriaToDb(db, criteria);
              }
            }
            resolve();
          }
          reader.readAsText(file);
        });
        this.criterias = await bd.getCriteriasFromDb(this.db, this.id);
        this.addDisabled = false;
      } else {
        this.showError = true;
      }
      this.showImport = false;
    },
  },

}
</script>

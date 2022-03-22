<template>
  <div v-if="ready">
    <p>{{ warningMessage }}</p>
    <ul>
      <li v-for="element in elementList" :key="element.id">
        <div v-if="element.updated">
          <slot name="element_update_display" v-bind:element="element"></slot>
        </div>
        <div v-else>
          <slot name="element_show_display" v-bind:element="element"></slot>
        </div>
        <slot name="element_display" v-bind:element="element"></slot>
      </li>
    </ul>
    <slot name="input_field" v-bind:mutable="mutableObject"></slot>
  </div>
</template>

<script>
export default {
  name: "BasicListDisplay",
  props: {
    ready: Boolean,
    elementList: Array,
    mutableObject: Object,
    messageDisplayCondition: Boolean,
  },
  computed : {
    warningMessage: function () {
      return this.messageDisplayCondition ? "" : "Veuillez remplir le champ"
    }
  },
  methods : {}
}
</script>

<style scoped>

</style>
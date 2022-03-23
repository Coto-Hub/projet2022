<template>
  <div class="basicListDisplay" v-if="ready">
    <div>
      <slot name="element_display" v-bind:mutable="mutableObjectUpdate"></slot>
    </div>
    <ul class="list">
      <li class="listItem" v-for="element in elementList" :key="element.id">
        <div v-if="element.updated">
          <slot name="element_update_display" v-bind:element="element"></slot>
        </div>
        <div v-else>
          <slot name="element_show_display" v-bind:element="element"></slot>
        </div>
      </li>
    </ul>
    <div class="add display-input">
      <slot name="input_field" v-bind:mutable="mutableObjectAdd"></slot>
      <p class="warning">{{ warningMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BasicListDisplay",
  props: {
    ready: Boolean,
    elementList: Array,
    mutableObjectAdd: Object,
    mutableObjectUpdate: Object,
    messageDisplayCondition: Boolean,
  },
  computed : {
    warningMessage: function () {
      return this.messageDisplayCondition ? "" : "Veuillez remplir le(s) champ(s)"
    }
  },
  methods : {}
}
</script>

<style scoped>

</style>
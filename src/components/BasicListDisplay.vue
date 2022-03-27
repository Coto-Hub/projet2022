<template>
  <div class="basicDisplay" v-if="ready">
    <h1>{{ title }}</h1>
    <div>
      <slot name="element_display" v-bind:mutable="mutableObjectUpdate"></slot>
    </div>
    <ul class="list">
      <li class="listItem">
        <div class="info">
          <div class="listItemLeft">
            {{ elementListLeft }}
          </div>
          <div class="listItemRight">
            {{ elementListRight }}
          </div>
        </div>
      </li>
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
    elementListLeft: String,
    elementListRight: String,
    ready: Boolean,
    elementList: Array,
    title: String,
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
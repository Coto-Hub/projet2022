<template>
  <div class="basicAlertDisplay" v-if="ready">
    <div class="alertBox" :class="isLittle?' little':'middle'">
      <div class="headerBox">
        <slot name="element_display"></slot>
      </div>
      <div class="footerBox">
        <slot name="input_field"></slot>
      </div>
      <p v-if="showMessage" class="red">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BasicAlertDisplay",
  props: {
    ready: Boolean,
    message: String,
    showMessage: Boolean,
    isLittle: Boolean,
  },
  computed : {
  },
  methods : {}
}
</script>
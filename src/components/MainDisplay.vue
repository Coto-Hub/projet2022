<template>
  <div class="content">
    <header class="header">
      <h1>{{ appTitle }}</h1>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer class="footer">
      <h1 class="footer_text">Site by Coto & Alexis</h1>
    </footer>
  </div>
</template>

<script>
export default {
  name: "MainDisplay",
  props: {
    appTitle: String
  }
}
</script>

<style scoped>

</style>
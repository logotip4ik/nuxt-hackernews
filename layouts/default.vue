<template>
  <div :class="{ 'main-layout': true, 'main-layout--dark': darkMode }">
    <Navbar />
    <Nuxt keep-alive />
    <button
      :class="{
        main__toggle: true,
        'main__toggle--dark': darkMode,
      }"
      @click="toggleDarkMode"
    >
      {{ darkMode ? 'light' : 'dark' }}
    </button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['darkMode']),
  },
  mounted() {
    this.checkDarkMode()
  },
  methods: {
    ...mapMutations(['checkDarkMode', 'toggleDarkMode']),
  },
}
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  /* font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif; */
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  height: 100%;
}
body {
  min-height: 100%;
}
.main-layout {
  min-height: 100vh;

  &--dark {
    background-color: #1f2129;
    color: #aaa;
  }
}
</style>

<template>
  <Nuxt keep-alive />
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  mounted() {
    this.checkDarkMode()
  },
  methods: {
    ...mapMutations(['checkDarkMode']),
  },
}
</script>

<style>
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
.main {
  min-height: 100vh;
}
</style>

<template>
  <div :class="{ 'main-layout': true, 'main-layout--dark': darkMode }">
    <Navbar />
    <Nuxt keep-alive />
    <button
      :class="{
        toggle: true,
        'toggle--dark': darkMode,
      }"
      @click="toggleDarkMode"
    >
      <svg
        v-if="darkMode"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-sun"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-moon"
        viewBox="0 0 16 16"
      >
        <path
          d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['darkMode']),
  },
  mounted() {
    const darkMode = localStorage.getItem('__darkMode')
    if (darkMode && JSON.parse(darkMode)) this.toggleDarkMode()
    this.initDB()
  },
  methods: {
    ...mapActions(['initDB', 'toggleDarkMode']),
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

.toggle {
  position: fixed;
  bottom: 5%;
  right: 8%;
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.25);
  background-color: whitesmoke;
  cursor: pointer;
  transition: background-color 200ms ease-out, color 200ms ease-out;

  &:hover {
    background-color: darken($color: #ffffff, $amount: 10);
  }

  &--dark {
    color: #aaa;
    border-color: #333;
    background-color: #1f2129;

    &:hover {
      color: white;
      background-color: lighten($color: #1f2129, $amount: 10);
    }
  }

  svg {
    transform: scale(1.1);
  }
}
</style>

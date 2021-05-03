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
      <img v-if="darkMode" src="~/assets/sun.svg" alt="sun icon" />
      <img v-else src="~/assets/moon.svg" alt="moon icon" />
    </button>
    <transition :css="false" @enter="enter" @leave="leave">
      <div v-if="$nuxt.isOffline" class="popup">
        <span>You are offline</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import gsap from 'gsap'

export default {
  computed: {
    ...mapState(['darkMode']),
  },
  watch: {
    darkMode(val) {
      localStorage.setItem('__darkMode', JSON.stringify(val))
    },
  },
  mounted() {
    const darkMode = localStorage.getItem('__darkMode')
    if (darkMode && JSON.parse(darkMode)) this.toggleDarkMode()
    this.initDB()
  },
  methods: {
    ...mapActions(['initDB', 'toggleDarkMode']),
    enter(el, onComplete) {
      gsap.fromTo(el, { translateY: '100%' }, { translateY: '0', onComplete })
    },
    leave(el, onComplete) {
      gsap.to(el, { translateY: '100%', onComplete })
    },
    refresh() {
      window.location.reload()
    },
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
  $toggle-size: 3.5rem;
  position: fixed;
  bottom: 5%;
  right: 8%;
  border: none;
  border-radius: 50%;
  width: $toggle-size;
  height: $toggle-size;
  box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.25);
  background-color: whitesmoke;
  cursor: pointer;
  transition: background-color 200ms ease-out, color 200ms ease-out;

  &:hover {
    background-color: darken($color: #ffffff, $amount: 10);
  }

  &--dark {
    border-color: #333;
    background-color: #1f2129;

    &:hover {
      background-color: lighten($color: #1f2129, $amount: 10);
    }
  }

  img {
    transform: scale(1.5);
  }
}

.popup {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #79ffe1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  color: rgb(49, 49, 49);

  & > * {
    margin: 0.3rem 0.5rem;
  }

  button {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    background-color: #79ffe1;
    border: none;
    display: flex;
    font: inherit;
    color: currentColor;
    position: relative;
    cursor: pointer;
    z-index: 1;
    img {
      transform: translateY(0.25px);
      margin-right: 0.25rem;
    }

    &::after {
      z-index: -1;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba($color: #000000, $alpha: 0.15);
      border-radius: 0.25rem;
      opacity: 0;
      transition: opacity 200ms ease-out;
    }

    &:hover::after {
      opacity: 1;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

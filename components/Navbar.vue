<template>
  <nav :class="{ nav: true, 'nav--dark': darkMode }">
    <h1 class="nav__heading" @click="$router.push('/newstories/1')">
      HackerNews Clone
    </h1>

    <div class="nav__links">
      <NuxtLink
        v-for="item in links"
        :key="item.id"
        :to="item.link"
        :prefetch="true"
        :class="darkMode ? 'dark' : null"
      >
        {{ item.name }}
      </NuxtLink>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    links: [
      { id: Math.random() * 100, link: '/beststories/1', name: 'Beststories' },
      { id: Math.random() * 100, link: '/topstories/1', name: 'Topstories' },
    ],
  }),
  computed: {
    ...mapState(['darkMode']),
  },
}
</script>

<style lang="scss">
.nav {
  width: 100%;
  padding: 0.5rem 1rem;
  box-shadow: 0 10px 10px 0 rgba($color: #000000, $alpha: 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 200ms ease-out;

  &--dark {
    background-color: rgb(39, 41, 51);
    color: #aaa;
  }

  &__heading {
    font-size: 2rem;
    cursor: pointer;
  }
  &__links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.25rem;

    a {
      color: rgb(73, 73, 73);
      text-decoration: none;
      margin: 0 0.5rem;
      position: relative;

      &:hover::after {
        transform: scaleX(1);
        transform-origin: left center;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -10%;
        left: 0;
        width: 100%;
        height: 1.5px;
        background-color: rgb(73, 73, 73);
        transition: transform 200ms ease-out;
        transform: scaleX(0);
        transform-origin: right center;
      }

      &.dark {
        color: #aaa;
        &::after {
          background-color: #aaa;
        }
      }
    }
  }
}
</style>

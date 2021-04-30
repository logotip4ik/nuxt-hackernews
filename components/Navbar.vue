<template>
  <nav :class="{ nav: true, 'nav--dark': darkMode }">
    <NuxtLink class="nav__heading" to="/s/new/1"> HackerNews Clone </NuxtLink>
    <ul class="nav__links">
      <NuxtLink
        v-for="item in links"
        :key="item.id"
        :class="{
          dark: darkMode,
          active: item.name.toLowerCase().includes(route),
        }"
        :to="item.link"
      >
        {{ item.name }}
      </NuxtLink>
    </ul>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data: () => ({
    links: [
      { id: Math.random() * 100, link: '/s/best/1', name: 'Beststories' },
      { id: Math.random() * 100, link: '/s/top/1', name: 'Topstories' },
      { id: Math.random() * 100, link: '/s/starred', name: 'Starred' },
    ],
  }),
  computed: {
    ...mapState(['darkMode']),
    route() {
      const name = this.$route.name.split('-')[1]
      if (name !== 'stories') return name
      const { stories } = this.$route.params
      return !stories ? 'new' : stories
    },
  },
  methods: {
    ...mapActions(['fetchPostsIds', 'fetchPosts']),
    preparePostsIds(storiesName) {
      if (storiesName === 'Starred') return
      const formatedStroies = storiesName.slice(0, -7).toLowerCase()
      this.$nuxt.$loading.start()
      this.fetchPostsIds({ stories: formatedStroies }).then(() => {
        this.$nuxt.$loading.start()
        this.fetchPosts({
          from: 0,
          to: 10,
          postsIds: `${formatedStroies}StoriesIds`,
          stories: `${formatedStroies}Stories`,
        }).then(() => this.$nuxt.$loading.finish())
      })
    },
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
  transition: background-color 200ms ease-out, color 200ms ease-out;

  &--dark {
    background-color: #272933;
    color: #aaa;
  }

  &__heading {
    font-size: 2rem;
    cursor: pointer;
    color: currentColor;
    text-decoration: none;
    font-weight: bold;
  }
  &__links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style-type: none;
    padding: 0 0.25rem;

    a {
      color: rgb(73, 73, 73);
      text-decoration: none;
      margin: 0 0.5rem;
      position: relative;
      cursor: pointer;

      &:hover::after {
        transform: scaleX(1);
        transform-origin: left center;
      }

      &.active::after {
        transform: scaleX(1);
        transform-origin: center center;
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

@media screen and (max-width: 490px) {
  .nav {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
}
</style>

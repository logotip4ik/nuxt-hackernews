<template>
  <div :class="{ main: true, 'main--dark': darkMode }">
    <Navbar />
    <div class="main__container">
      <Item v-for="post in pagePosts" :key="post.id" :post="post">
        {{ post.title }}
        <template #by>By: {{ post.by }}</template>
      </Item>
    </div>
    <div :class="{ main__pages: true, 'main__pages--dark': darkMode }">
      <button @click="changePage(-1)">&minus;</button>
      <span>{{ currPage + 1 }}</span>
      <button @click="changePage(1), fetch()">&plus;</button>
    </div>
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
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  asyncData({ params, error, store }) {
    const whitelist = [undefined, 'topstories', 'beststories']
    const idx = whitelist.indexOf(params.stories)
    if (idx === -1) {
      error(404)
      return
    }

    let stories = 'new'
    if (idx === 1) stories = 'top'
    if (idx === 2) stories = 'best'

    return { stories, posts: store.getters[`${stories}Stories`] }
  },
  computed: {
    ...mapState({
      currPage: 'currPage',
      darkMode: 'darkMode',
    }),
    pagePosts() {
      const from = this.currPage * 10
      const to = (this.currPage + 1) * 10
      return this.posts?.slice(from, to)
    },
  },
  watch: {
    darkMode(val) {
      localStorage.setItem('__darkMode', JSON.stringify(val))
    },
    '$route.params'(params) {
      const whitelist = [undefined, 'topstories', 'beststories']
      const idx = whitelist.indexOf(params.stories)

      let stories = 'new'
      if (idx === 1) stories = 'top'
      if (idx === 2) stories = 'best'
      this.changePage(-this.currPage)
      this.fetchPostsIds({ stories, cb: () => this.fetch(stories) })
    },
  },
  mounted() {
    this.checkDarkMode()
  },
  methods: {
    ...mapMutations(['changePage', 'checkDarkMode', 'toggleDarkMode']),
    ...mapActions(['fetchPosts', 'fetchPostsIds']),
    fetch(stories) {
      const from = 10 * this.currPage
      const to = 10 * (this.currPage + 1)
      this.fetchPosts({
        from,
        to,
        postsIds: `${!stories ? this.stories : stories}StoriesIds`,
        stories: `${!stories ? this.stories : stories}Stories`,
      })
    },
  },
}
</script>

<style lang="scss">
.main {
  padding-bottom: 2rem;
  color: rgb(73, 73, 73);
  transition: background-color 200ms ease-out, color 200ms ease-out;

  &--dark {
    background-color: rgb(31, 33, 41);
    color: #aaa;
  }

  &__container {
    max-width: 90vw;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 0.25rem;
    margin: 0 auto;
  }
  &__pages {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    button {
      $button-size: 35px;
      appearance: none;
      border-radius: 100%;
      height: $button-size;
      color: rgb(73, 73, 73);
      width: $button-size;
      border: 1px solid #ddd;
      box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.1);
      background-color: transparent;
      font-size: 1.5rem;
      transition: background-color 200ms ease-out;
      &:hover {
        background-color: darken($color: #ffffff, $amount: 10);
      }
    }
    span {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 1rem;
    }

    &--dark button {
      color: #aaa;
      border-color: #333;
      box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.25);

      &:hover {
        background-color: lighten($color: #1f2129, $amount: 10);
      }
    }
  }
  &__toggle {
    position: fixed;
    bottom: 4rem;
    right: 5rem;
  }
}

.news-enter-active,
.news-leave-active {
  transition: opacity 0ms ease-out;
}

.news-enter-from,
.news-leave-to {
  // transform: translateX(-100%);
  opacity: 0;
  display: none;
}
</style>

<template>
  <div :class="{ main: true, 'main--dark': darkMode }">
    <Navbar />
    <transition-group class="main__container" tag="div" name="fade">
      <Item v-for="post in pagePosts" :key="post.id" :post="post">
        {{ post.title }}
        <template #by>By: {{ post.by }}</template>
      </Item>
    </transition-group>
    <div :class="{ main__pages: true, 'main__pages--dark': darkMode }">
      <button @click="redirect(-1)">&minus;</button>
      <span>{{ currPage }}</span>
      <button @click="redirect(1), fetch(currPage + 1)">&plus;</button>
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
  transition: 'fade',
  asyncData({ params, error, store }) {
    const currPage = isNaN(params.page) ? 1 : Number.parseInt(params.page)
    const whitelist = [undefined, 'newstories', 'topstories', 'beststories']
    const idxStories = whitelist.indexOf(params.stories)
    if (idxStories === -1) {
      error(404)
      return
    }

    let stories = 'new'
    if (idxStories === 2) stories = 'top'
    if (idxStories === 3) stories = 'best'

    return { stories, currPage, posts: store.getters[`${stories}Stories`] }
  },
  computed: {
    ...mapState({
      darkMode: 'darkMode',
      loading: 'loading',
    }),
    pagePosts() {
      const from = (this.currPage - 1) * 10
      const to = this.currPage * 10
      return this.posts?.slice(from, to)
    },
  },
  watch: {
    darkMode(val) {
      localStorage.setItem('__darkMode', JSON.stringify(val))
    },
    async '$route.params.stories'(stories, oldStories = 'newstories') {
      const formatedStroies = stories.slice(0, -7)
      const formatedOldStroies = oldStories.slice(0, -7)
      if (formatedStroies === formatedOldStroies) return
      this.$nuxt.$loading.start()
      console.log('calling fetchPostsIds and fetchPosts')
      await this.fetchPostsIds({ stories: formatedStroies })
      this.fetch(1, formatedStroies)
    },
  },
  mounted() {
    this.checkDarkMode()
  },
  methods: {
    ...mapMutations(['checkDarkMode', 'toggleDarkMode', 'toggleLoading']),
    ...mapActions(['fetchPosts', 'fetchPostsIds']),
    fetch(currPage = this.currPage, stories = this.stories) {
      const from = 10 * (currPage - 1)
      const to = 10 * currPage
      this.$nuxt.$loading.start()
      this.fetchPosts({
        from,
        to,
        postsIds: `${stories}StoriesIds`,
        stories: `${stories}Stories`,
      }).then(() => this.$nuxt.$loading.finish())
    },
    redirect(num) {
      if (this.currPage + num <= 0) return
      this.$router.push(`/${this.stories}stories/${this.currPage + num}`)
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
  }
}

.fade-enter-active > .main__container,
.fade-leave-active > .main__container {
  transition: opacity 0.5s;
}
.fade-enter-active > .main__container {
  transition-timing-function: cubic-bezier(0.12, 0, 0.39, 0);
}
.fade-leave-active > .main__container {
  transition-timing-function: cubic-bezier(0.61, 1, 0.88, 1);
}
.fade-enter > .main__container,
.fade-leave-to > .main__container {
  opacity: 0;
}
</style>

<template>
  <div ref="posts" :class="{ main: true, 'main--dark': darkMode }">
    <div ref="loader" :class="{ loader: true, 'loader--dark': darkMode }">
      <svg
        ref="loaderArrow"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-arrow-clockwise"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
        />
        <path
          d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
        />
      </svg>
    </div>
    <div class="main__container">
      <Item v-for="post in pagePosts" :key="post.id" :post="post">
        {{ post.title }}
        <template #by>{{ post.by }}</template>
      </Item>
    </div>
    <div :class="{ main__pages: true, 'main__pages--dark': darkMode }">
      <button @click="redirect(-1)">&minus;</button>
      <span>{{ currPage }}</span>
      <button @click="redirect(1), fetch(currPage + 1)">&plus;</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import gsap from 'gsap'

export default {
  transition: 'fade',
  asyncData({ params, error, store }) {
    const currPage = isNaN(params.page) ? 1 : Number.parseInt(params.page)
    const whitelist = [undefined, 'new', 'top', 'best']
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
  data: () => ({
    pStart: { x: 0, y: 0 },
    pStop: { x: 0, y: 0 },
  }),
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
  },
  mounted() {
    this.$refs.posts.addEventListener('touchstart', this.swipeStart, false)
    this.$refs.posts.addEventListener('touchmove', this.swipeMove)
    this.$refs.posts.addEventListener('touchend', this.swipeEnd, false)
  },
  beforeDestroy() {
    this.$refs.posts.removeEventListener(this.swipeStart)
    this.$refs.posts.removeEventListener(this.swipeMove)
    this.$refs.posts.removeEventListener(this.swipeEnd)
  },
  methods: {
    ...mapMutations(['toggleDarkMode', 'toggleLoading']),
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
      this.$router.push(`/s/${this.stories}/${this.currPage + num}`)
    },
    refresh() {
      gsap.to(this.$refs.loaderArrow, {
        rotateZ: 720,
        repeat: -1,
        duration: 0.9,
        ease: 'none',
      })
      window.location.pathname = `/s/${this.stories}/1`
    },
    swipeStart(e) {
      if (typeof e.targetTouches !== 'undefined') {
        const touch = e.targetTouches[0]
        this.pStart.x = touch.screenX
        this.pStart.y = touch.screenY
      } else {
        this.pStart.x = e.screenX
        this.pStart.y = e.screenY
      }
    },
    swipeMove(e) {
      const y = e.targetTouches[0].screenY - this.pStart.y - 25
      const yFormated = y > 100 ? 100 + y * 0.05 : y
      gsap.to(this.$refs.loader, { translateY: yFormated })
      gsap.to(this.$refs.loaderArrow, { rotateZ: yFormated * 2 })
    },
    swipeEnd(e) {
      gsap.to(this.$refs.loader, { translateY: 100 })
      if (typeof e.changedTouches !== 'undefined') {
        const touch = e.changedTouches[0]
        this.pStop.x = touch.screenX
        this.pStop.y = touch.screenY
      } else {
        this.pStop.x = e.screenX
        this.pStop.y = e.screenY
      }
      this.swipeCheck()
    },

    swipeCheck() {
      const changeY = this.pStart.y - this.pStop.y
      const changeX = this.pStart.x - this.pStop.x
      if (this.isPullDown(changeY, changeX)) return this.refresh()
      gsap.to(this.$refs.loader, { translateY: -150 })
    },
    isPullDown(dY, dX) {
      return (
        dY < 0 &&
        ((Math.abs(dX) <= 100 && Math.abs(dY) >= 300) ||
          (Math.abs(dX) / Math.abs(dY) <= 0.3 && dY >= 60))
      )
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
    background-color: #1f2129;
    color: #aaa;

    .ptr--icon,
    .ptr--text {
      color: #aaa !important;
    }
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

.loader {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1px solid rgba($color: #999, $alpha: 0.5);
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translate3d(-50%, -90px, 0);
  background-color: whitesmoke;
  box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.25);
  text-align: center;
  padding-top: 0.9rem;

  &--dark {
    background-color: #1f2129;
  }
  svg {
    transform: scale(1.75);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-active {
  transition-delay: 500ms;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

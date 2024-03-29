<template>
  <div ref="posts" :class="{ main: true, 'main--dark': darkMode }">
    <div ref="loader" :class="{ loader: true, 'loader--dark': darkMode }">
      <img
        ref="loaderArrow"
        src="~/assets/circle-arrow.svg"
        alt="circle arrow icon"
      />
    </div>
    <div class="container">
      <Item v-for="post in posts" :key="post.id" :post="post">
        {{ post.title }}
        <template #by>{{ post.by }}</template>
      </Item>
    </div>
    <div :class="{ main__pages: true, 'main__pages--dark': darkMode }">
      <NuxtLink v-if="currPage - 1 > 0" :to="`/s/${stories}/${currPage - 1}`">
        &minus;
      </NuxtLink>
      <span>{{ currPage }}</span>
      <NuxtLink :to="`/s/${stories}/${currPage + 1}`">&plus;</NuxtLink>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import gsap from 'gsap'

export default {
  transition: {
    css: false,
    mode: 'out-in',
    enter(el, onComplete) {
      gsap.fromTo(el, { delay: 0.1, opacity: 0 }, { opacity: 1, onComplete })
    },
    leave(el, onComplete) {
      gsap.to(el, { opacity: 0, onComplete })
    },
  },
  async asyncData({ params, error, store }) {
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

    const postsIds = await store.dispatch('fetchPostsIds', { stories })
    const posts = await store.dispatch('fetchPosts', {
      from: 10 * (currPage - 1),
      to: 10 * currPage,
      postsIds,
      stories: `${stories}Stories`,
    })

    return { stories, currPage, posts }
  },
  data: () => ({
    pStart: { x: 0, y: 0 },
    pStop: { x: 0, y: 0 },
  }),
  computed: {
    ...mapState(['darkMode']),
  },
  mounted() {
    this.$refs.posts.addEventListener('touchstart', this.swipeStart, false)
    this.$refs.posts.addEventListener('touchmove', this.swipeMove)
    this.$refs.posts.addEventListener('touchend', this.swipeEnd, false)
  },
  beforeDestroy() {
    this.$refs.posts.removeEventListener('touchstart', this.swipeStart)
    this.$refs.posts.removeEventListener('touchmove', this.swipeMove)
    this.$refs.posts.removeEventListener('touchend', this.swipeEnd)
  },
  methods: {
    ...mapActions(['toggleDarkMode']),
    enter(el, onComplete) {
      gsap.fromTo(el, { delay: 0.2, opacity: 0 }, { opacity: 1, onComplete })
    },
    refresh() {
      gsap.to(this.$refs.loaderArrow, {
        rotateZ: 1080,
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

  &__pages {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    a {
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
      text-align: center;
      text-decoration: none;
      &:hover {
        background-color: darken($color: #ffffff, $amount: 10);
      }
    }
    span {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 1rem;
    }

    &--dark a {
      color: #aaa;
      border-color: #333;
      box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.25);

      &:hover {
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
  z-index: 99;

  &--dark {
    background-color: #1f2129;

    img {
      filter: invert(1);
    }
  }
  img {
    transform: scale(1.75);
  }
}
</style>

<template>
  <div class="container">
    <div class="details">
      <h2 class="details__header">{{ post.title }}</h2>
      <small class="details__by">
        By: <span @click="openUser(post.by)">{{ post.by }}</span>
      </small>
      <p class="details__text" v-html="post.text"></p>
    </div>
    <div class="answers">
      <Answer v-for="post in post.kids" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  head() {
    return {
      title: this.post.title,
    }
  },
  computed: {
    ...mapState({ post: 'hnItem' }),
  },
  methods: {
    ...mapActions(['fetchUser']),
    openUser(id) {
      this.$nuxt.$loading.start()
      this.fetchUser(id).then(() => {
        this.$router.push(`/u/${id}`)
        this.$nuxt.$loading.finish()
      })
    },
  },
}
</script>

<style lang="scss">
.container {
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0.25rem;
  margin: 0 auto;
}

.details {
  width: 100%;

  &__header {
  }
  &__by {
    span {
      color: currentColor;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
  &__text {
    margin-top: 1rem;
    line-height: 1.5rem;
    font-size: 1.1rem;
  }
}
.answers {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 0.5rem;
}
</style>

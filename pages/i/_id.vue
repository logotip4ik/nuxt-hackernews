<template>
  <div class="container">
    <div class="details">
      <h2 class="details__header">{{ post.title }}</h2>
      <small class="details__by">
        By: <NuxtLink :to="`/u/${post.by}`">{{ post.by }}</NuxtLink>
      </small>
      <p class="details__text" v-html="post.text"></p>
    </div>
    <div class="answers">
      <Answer v-for="post in post.kids" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ store, params, error }) {
    if (!params.id) return error(404)
    const post = await store.dispatch('fetchItem', params.id)
    return { post }
  },
  head() {
    return {
      title: this.post.title,
    }
  },
}
</script>

<style lang="scss">
.details {
  width: 100%;

  &__header {
  }
  &__by {
    a {
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

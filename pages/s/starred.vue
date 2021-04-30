<template>
  <div class="container">
    <transition name="fade">
      <h1 v-if="starredItems.length === 0">
        Oops, you have no starred stories
      </h1>
    </transition>
    <Item v-for="post in starredItems" :key="post.id" :post="post">
      {{ post.title }}
      <template #by>{{ post.by }}</template>
    </Item>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['starredItems']),
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
</style>

<template>
  <div class="container">
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

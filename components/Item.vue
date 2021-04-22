<template>
  <div :class="{ item: true, 'item--dark': darkMode }">
    <h3
      :class="{ item__heading: true, 'item__heading--dark': darkMode }"
      @click="openURL(post.url)"
    >
      <slot></slot>
    </h3>
    <small><slot name="by"></slot></small>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    post: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState(['darkMode']),
  },
  methods: {
    openURL(url) {
      window.open(url)
    },
  },
}
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.1);
  border-radius: 0.25rem;
  margin: 0.25rem 0.5rem 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  transition: border-color 200ms ease-out;

  &--dark {
    border-color: #333;
    box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.25);
  }

  &__heading {
    cursor: pointer;
    transition: color 200ms ease-out;

    &:hover {
      color: black;
    }

    &--dark:hover {
      color: whitesmoke;
    }
  }
}
</style>

<template>
  <div :class="{ item: true, 'item--dark': darkMode }">
    <a
      :class="{ item__heading: true, 'item__heading--dark': darkMode }"
      :href="`${post.url}`"
      target="_blank"
    >
      <slot></slot>
    </a>
    <small class="item__by">
      By:
      <span @click="openUser($slots.by[0].text)">
        <slot name="by"></slot>
      </span>
    </small>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

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

<style lang="scss" scoped>
.item {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.1);
  border-radius: 0.25rem;
  margin: 0.25rem 0.5rem 1rem;
  background-color: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  transition: background-color 200ms ease-out, color 200ms ease-out,
    border-color 200ms ease-out;

  &--dark {
    border-color: #333;
    box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.25);
    background-color: rgb(31, 33, 41);
  }

  &__heading {
    cursor: pointer;
    transition: color 200ms ease-out;
    font-size: 1.4rem;
    font-weight: 600;
    text-decoration: none;
    color: currentColor;

    &:hover {
      color: black;
    }

    &--dark:hover {
      color: whitesmoke;
    }
  }
  &__by {
    font-size: 0.9rem;
    span {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>

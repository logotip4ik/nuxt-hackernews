<template>
  <div :class="{ item: true, 'item--dark': darkMode }">
    <a
      v-if="post.url"
      :class="{ item__heading: true, 'item__heading--dark': darkMode }"
      :href="`${post.url}`"
      target="_blank"
    >
      <slot></slot>
    </a>
    <NuxtLink
      v-else
      :class="{ item__heading: true, 'item__heading--dark': darkMode }"
      :to="`/i/${post.id}`"
    >
      <slot></slot>
    </NuxtLink>
    <div class="item__details">
      <small class="item__details__by">
        By:
        <NuxtLink :to="`/u/${$slots.by[0].text}`">
          <slot name="by"></slot>
        </NuxtLink>
      </small>
      <small class="item__details__time">{{ timePassed }}</small>
    </div>
    <transition name="fade" mode="out-in">
      <svg
        v-if="!isStarred"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="item__star"
        viewBox="0 0 16 16"
        @click="starItem"
      >
        <path
          d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="item__star item__star--filled"
        viewBox="0 0 16 16"
        @click="removeFromStarredItems(post)"
      >
        <path
          d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
        />
      </svg>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import * as timeago from 'timeago.js'

export default {
  props: {
    post: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState(['darkMode', 'starredItems']),
    timePassed() {
      return timeago.format(this.post.time * 1000)
    },
    isStarred() {
      for (let i = 0; i < this.starredItems.length; i++) {
        const post = this.starredItems[i]
        if (post.id === this.post.id) return true
      }
      return false
    },
  },
  methods: {
    ...mapActions(['addToStarredItems', 'removeFromStarredItems']),
    starItem() {
      const item = { ...this.post, addedAt: new Date().getTime() }
      this.addToStarredItems(item)
    },
  },
}
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  padding: 0.5rem 1rem;
  padding-right: 1.5rem;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.1);
  border-radius: 0.25rem;
  margin: 0.25rem 0.5rem 1rem;
  background-color: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  position: relative;
  transition: background-color 200ms ease-out, color 200ms ease-out,
    border-color 200ms ease-out;

  &--dark {
    color: #aaa;
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
  &__details {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &__by {
      color: currentColor;
      font-size: 0.9rem;
      a {
        color: currentColor;
        cursor: pointer;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  &__star {
    position: absolute;
    top: 5px;
    right: 5px;
    transform-origin: top right;
    transform: scale(1.2);

    &--filled {
      color: rgb(247, 219, 62);
    }
  }
}
</style>

<template>
  <div class="answer">
    <div class="answer__details">
      <p class="answer__details__by">
        By: <span @click="openUser(post.by)">{{ post.by }}</span>
      </p>
      <small class="answer__details__date">{{ formatTime(post.time) }}</small>
    </div>
    <p class="answer__text" v-html="post.text"></p>
    <div v-if="post.kids" class="answer__commets">
      <Answer v-for="commet in post.kids" :key="commet.id" :post="commet" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import * as timeago from 'timeago.js'

export default {
  props: {
    post: { type: Object, required: true, default: () => ({}) },
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
    formatTime(time) {
      return timeago.format(time * 1000)
    },
  },
}
</script>

<style lang="scss">
.answer {
  width: 100%;
  margin-top: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #999;

  &__details {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;

    &__by span {
      cursor: pointer;
      color: currentColor;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__text {
    padding: 0.25rem;
    a {
      color: currentColor;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__commets {
    padding-left: 1.5rem;
  }
}
</style>

<template>
  <div :class="{ main: true, 'main--dark': darkMode }">
    <table>
      <tbody>
        <tr>
          <td>User:</td>
          <td class="right">{{ user.id }}</td>
        </tr>
        <tr :class="{ inverted: true, 'inverted--dark': darkMode }">
          <td>Created:</td>
          <td class="right">{{ daysToNow }}</td>
        </tr>
        <tr>
          <td>Karma:</td>
          <td class="right">{{ user.karma }}</td>
        </tr>
        <tr
          v-if="user.about"
          :class="{ inverted: true, 'inverted--dark': darkMode }"
        >
          <td>About:</td>
          <td class="right" v-html="user.about"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as timeago from 'timeago.js'

export default {
  async asyncData({ store, params, error }) {
    if (!params.id) return error(404)
    const user = await store.dispatch('fetchUser', params.id)
    if (!user) return error(`User "${params.id}" not found!`)
    return { user }
  },
  head() {
    return {
      title: `${this.user.id} - Hackernews User`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Name: ${this.user.id}, Created: ${this.daysToNow}, Karma: ${this.user.karma}`,
        },
      ],
    }
  },
  computed: {
    ...mapState(['darkMode']),
    daysToNow() {
      return timeago.format(this.user.created * 1000)
    },
  },
}
</script>

<style lang="scss">
.main {
  padding-bottom: 2rem;
  color: rgb(73, 73, 73);
  transition: background-color 200ms ease-out, color 200ms ease-out;
  min-height: calc(100vh - 56px);
  padding-top: 1rem;

  &--dark {
    background-color: #1f2129;
    color: #aaa;
  }

  table {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    text-align: left;
    font-size: 1.1rem;
    border-spacing: 5px;
    td {
      padding: 0.5rem 0;
      border-bottom: 1px solid #999;
      word-wrap: break-word;
      overflow: hidden;
    }
    .right {
      font-size: 1rem;

      * {
        word-wrap: break-word;
        white-space: pre-wrap;
      }
    }
    .inverted {
      position: relative;
      z-index: 1;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        background-color: whitesmoke;
        border-bottom: 1px solid #999;
      }
      &--dark::after {
        background-color: #2d303b;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  table tr {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-bottom: 1rem;

    td:first-of-type {
      border-bottom: none;
    }
  }
}
</style>

<template>
  <div :class="{ main: true, 'main--dark': darkMode }">
    <Navbar />
    <!-- <div class="main__container"> -->
    <table>
      <tbody>
        <tr>
          <td>User:</td>
          <td class="right">{{ user.id }}</td>
        </tr>
        <tr :class="{ inverted: true, 'inverted--dark': darkMode }">
          <td>Created:</td>
          <!-- TODO: need to find out what this dateTime format is -->
          <td class="right">{{ user.created }}</td>
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
    <!-- </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user', 'darkMode']),
    // daysToNow() {
    //   if (!this.user.created) return ''
    //   const now = new Date()
    //   console.log(now.getTime())
    //   console.log(now.getTime() - Number(this.user.created))
    //   console.log(new Date(now.getTime() - Number(this.user.created)))
    //   // console.log(new Date(now.getTime() - Number(this.user.created)))
    //   return ''
    //   // return Intl.DateTimeFormat({
    //   //   day: 'numeric',
    //   //   month: 'long',
    //   //   year: 'numeric',
    //   // }).format(new Date(this.user.created))
    // },
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
  }

  table {
    width: 100%;
    max-width: 700px;
    margin: 0.25rem auto 0;
    text-align: left;
    font-size: 1.1rem;
    border-spacing: 5px;
    td {
      padding: 0.5rem 0;
      border-bottom: 1px solid #999;
    }
    .right {
      font-size: 1rem;
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

<template>
  <div class="main">
    <Navbar />
    <p v-if="$fetchState.pending">loading...</p>
    {{ posts }}
  </div>
</template>

<script>
export default {
  data: () => ({
    posts: [],
  }),
  async fetch() {
    const { data } = await this.$axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
    )

    for (let i = 0; i < data.slice(0, 10).length; i += 1) {
      const post = await this.$axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${data[i]}.json?print=pretty`
      )
      this.posts.push(post.data)
    }
  },
  // Do i really need this?
  fetchOnServer: false,
}
</script>

<style lang="scss">
.main {
  min-height: 100vh;
  background-color: rgb(31, 33, 41);
  color: #aaa;
}
</style>

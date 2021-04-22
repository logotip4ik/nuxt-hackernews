import axios from 'axios'

export const state = () => ({
  newStoriesIds: [],
  topStoriesIds: [],
  bestStoriesIds: [],
  newStories: [],
  topStories: [],
  bestStories: [],
  currPage: 0,
  loading: false,
  darkMode: false,
})

export const getters = {
  newStoriesIds: (state) => state.newStoriesIds,
  topStoriesIds: (state) => state.topStoriesIds,
  bestStoriesIds: (state) => state.bestStoriesIds,
  newStories: (state) => state.newStories,
  topStories: (state) => state.topStories,
  bestStories: (state) => state.bestStories,
}

export const mutations = {
  changePage(state, num) {
    if (num < 0 && state.currPage === 0) return
    state.currPage += num
  },
  setTo(state, { stories, value }) {
    state[stories].push(...value)
  },
  pushTo(state, { stories, posts }) {
    state[stories].push(...posts)
  },
  checkDarkMode(state) {
    const darkMode = localStorage.getItem('__darkMode')
    if (darkMode && JSON.parse(darkMode)) state.darkMode = true
  },
  toggleDarkMode(state) {
    state.darkMode = !state.darkMode
  },
}

export const actions = {
  async fetchPostsIds({ commit }, { stories, cb }) {
    const post = await axios.get(
      `https://hacker-news.firebaseio.com/v0/${stories}stories.json?print=pretty`
    )
    commit('setTo', { stories: `${stories}StoriesIds`, value: post.data })
    if (cb) cb.call()
  },
  async fetchPosts({ state, commit }, { from, to, postsIds, stories }) {
    if (state[stories] && state[stories][from + 1]) return
    const posts = []
    const pages = state[postsIds].slice(0, to).length
    for (let i = from; i < pages; i += 1) {
      const post = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${state[postsIds][i]}.json?print=pretty`
      )
      posts.push(post.data)
    }
    if (stories) {
      commit('pushTo', { stories, posts })
    } else return posts
  },
  async nuxtServerInit({ state, dispatch }, { params, error }) {
    const whitelist = [undefined, 'topstories', 'beststories']
    const idx = whitelist.indexOf(params.stories)
    if (idx === -1) {
      error(404)
      return
    }

    let stories = 'new'
    if (idx === 1) stories = 'top'
    if (idx === 2) stories = 'best'

    await dispatch('fetchPostsIds', { stories })

    const storiesIds = `${stories}StoriesIds`
    const from = state.currPage * 10
    const to = (state.currPage + 1) * 10
    const posts = await dispatch('fetchPosts', {
      from,
      to,
      postsIds: storiesIds,
    })
    state[`${stories}Stories`] = posts
  },
}

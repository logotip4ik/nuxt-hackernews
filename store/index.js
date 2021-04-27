import axios from 'axios'

export const state = () => ({
  newStoriesIds: [],
  topStoriesIds: [],
  bestStoriesIds: [],
  newStories: [],
  topStories: [],
  bestStories: [],
  user: {},
  currPage: 0,
  darkMode: false,
})

export const getters = {
  newStoriesIds: (state) => state.newStoriesIds,
  topStoriesIds: (state) => state.topStoriesIds,
  bestStoriesIds: (state) => state.bestStoriesIds,
  newStories: (state) => state.newStories,
  topStories: (state) => state.topStories,
  bestStories: (state) => state.bestStories,
  user: (state) => state.user,
  darkMode: (state) => state.darkMode,
}

export const mutations = {
  changePage(state, num) {
    if (num < 0 && state.currPage === 0) return
    state.currPage += num
  },
  setTo(state, { stories, value }) {
    state[stories].push(...value)
  },
  setUser(state, data) {
    state.user = data
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
  fetchUser({ commit }, id) {
    return new Promise((resolve, reject) =>
      axios
        .get(`https://hacker-news.firebaseio.com/v0/user/${id}.json`)
        .then(({ data }) => resolve(commit('setUser', data)))
        .catch((err) => reject(err))
    )
  },
  fetchPostsIds({ state, commit }, { stories }) {
    if (state[`${stories}StoriesIds`][0]) return
    return new Promise((resolve, reject) => {
      axios
        .get(`https://hacker-news.firebaseio.com/v0/${stories}stories.json`)
        .then(({ data: value }) =>
          resolve(commit('setTo', { value, stories: `${stories}StoriesIds` }))
        )
        .catch((err) => reject(err))
    })
  },
  fetchPosts({ state, commit }, { from, to, postsIds, stories }) {
    if (state[stories] && state[stories][from + 1]) return
    return new Promise((resolve, reject) => {
      const posts = []
      const pages = state[postsIds].slice(0, to).length
      for (let i = from; i < pages; i += 1) {
        posts.push(
          axios
            .get(
              `https://hacker-news.firebaseio.com/v0/item/${state[postsIds][i]}.json`
            )
            .then(({ data }) => data)
            .catch((err) => reject(err))
        )
      }
      Promise.all(posts).then((val) => {
        if (stories) return resolve(commit('pushTo', { stories, posts: val }))
        return resolve(val)
      })
    })
  },
  // prettier-ignore
  // eslint-disable-next-line
  async nuxtServerInit({ state, dispatch }, { params, error, route, redirect }) {
    if (route.path[1] === 's') {
      state.currPage = isNaN(params.page) ? 1 : Number.parseInt(params.page)

      const whitelist = [undefined, 'new', 'top', 'best']
      const idxStories = whitelist.indexOf(params.stories)
      if (idxStories === -1) return error(404)

      let stories = 'new'
      if (idxStories === 2) stories = 'top'
      if (idxStories === 3) stories = 'best'

      await dispatch('fetchPostsIds', { stories })

      const storiesIds = `${stories}StoriesIds`
      const from = (state.currPage - 1) * 10
      const to = state.currPage * 10
      const posts = await dispatch('fetchPosts', {
        from,
        to,
        postsIds: storiesIds,
      })
      state[`${stories}Stories`] = posts
    } else if (route.path[1] === 'u') {
      if (!params.id) return error('404 need to specify user id')
      await dispatch('fetchUser', params.id)
    } else redirect('/s')
  },
}

import axios from 'axios'
import Dexie from 'dexie'

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
  db: {},
  starredItems: [],
  hnItem: {},
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

export const actions = {
  toggleDarkMode({ state }) {
    state.darkMode = !state.darkMode
  },
  initDB({ state }) {
    const db = new Dexie('nuxt-hackernews')
    db.version(1).stores({
      starred: '&id, title, addedAt',
    })
    db.starred
      .orderBy('addedAt')
      .reverse()
      .toArray()
      .then((val) => state.starredItems.push(...val))
    state.db = db
  },
  addToStarredItems({ state }, val) {
    state.db.starred.add(val)
    state.starredItems.unshift(val)
  },
  removeFromStarredItems({ state }, val) {
    const { id } = val
    let i
    for (i = 0; i < state.starredItems.length; i++) {
      const post = state.starredItems[i]
      if (post.id === id) break
    }
    state.starredItems.splice(i, 1)
    state.db.starred.where({ id }).delete()
  },
  async fetchItem({ state, dispatch }, [id, initial = false]) {
    const { data } = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    )
    if (initial) state.hnItem = data
    if (!data.kids) return data
    const kids = []
    for (let i = 0; i < data.kids.length; i++) {
      kids.push(dispatch('fetchItem', [data.kids[i]]))
    }
    data.kids = await Promise.all(kids)
    return data
  },
  fetchUser({ state }, id) {
    return new Promise((resolve, reject) =>
      axios
        .get(`https://hacker-news.firebaseio.com/v0/user/${id}.json`)
        .then(({ data }) => resolve((state.user = data)))
        .catch((err) => reject(err))
    )
  },
  fetchPostsIds({ state }, { stories }) {
    if (state[`${stories}StoriesIds`][0]) return
    return new Promise((resolve, reject) => {
      axios
        .get(`https://hacker-news.firebaseio.com/v0/${stories}stories.json`)
        .then(({ data }) =>
          resolve(state[`${stories}StoriesIds`].push(...data))
        )
        .catch((err) => reject(err))
    })
  },
  fetchPosts({ state }, { from, to, postsIds, stories }) {
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
      Promise.all(posts).then((_val) => {
        const val = _val.filter(Boolean)
        if (stories) return resolve(state[stories].push(...val))
        return resolve(val)
      })
    })
  },
  // prettier-ignore
  // eslint-disable-next-line
  async nuxtServerInit({ state, dispatch }, { params, error, route, redirect }) {
    if (route.path[1] === 's') {
      // stands for starred route
      if (route.path[3] === 's') return
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
    } else if (route.path[1] === 'i') {
      if (!params.id) return error(404)
      await dispatch('fetchItem', [params.id, true])
    }
    else redirect('/s')
  },
}

export const strict = false

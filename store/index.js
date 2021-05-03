import axios from 'axios'
import Dexie from 'dexie'

export const state = () => ({
  newStoriesIds: [],
  topStoriesIds: [],
  bestStoriesIds: [],
  newStories: new Array(399),
  topStories: new Array(399),
  bestStories: new Array(399),
  currPage: 0,
  darkMode: false,
  db: {},
  user: {},
  starredItems: [],
})

export const getters = {
  newStoriesIds: (state) => state.newStoriesIds,
  topStoriesIds: (state) => state.topStoriesIds,
  bestStoriesIds: (state) => state.bestStoriesIds,
  newStories: (state) => state.newStories,
  topStories: (state) => state.topStories,
  bestStories: (state) => state.bestStories,
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
  async fetchItem({ dispatch }, id) {
    const { data } = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    )
    if (!data.kids) return data
    const kids = []
    for (let i = 0; i < data.kids.length; i++) {
      kids.push(dispatch('fetchItem', [data.kids[i]]))
    }
    data.kids = await Promise.all(kids)
    return data
  },
  fetchUser({ state }, id) {
    if (state.user.id === id) return state.user
    return new Promise((resolve, reject) =>
      axios
        .get(`https://hacker-news.firebaseio.com/v0/user/${id}.json`)
        .then(({ data }) => {
          if (data) state.user = data
          resolve(data)
        })
        .catch((err) => reject(err))
    )
  },
  fetchPostsIds({ state }, { stories }) {
    if (state[`${stories}StoriesIds`][0]) return state[`${stories}StoriesIds`]
    return new Promise((resolve, reject) => {
      axios
        .get(`https://hacker-news.firebaseio.com/v0/${stories}stories.json`)
        .then(({ data }) => {
          state[`${stories}StoriesIds`] = data
          resolve(data)
        })
        .catch((err) => reject(err))
    })
  },
  fetchPosts({ state }, { from, to, postsIds, stories }) {
    if (state[stories] && state[stories][from] && state[stories][to - 1])
      return state[stories].slice(from, to)
    return new Promise((resolve, reject) => {
      const posts = []
      const pages = postsIds.slice(0, to).length
      for (let i = from; i < pages; i += 1) {
        posts.push(
          axios
            .get(
              `https://hacker-news.firebaseio.com/v0/item/${postsIds[i]}.json`
            )
            .then(({ data }) => data)
            .catch((err) => reject(err))
        )
      }
      Promise.all(posts).then((_val) => {
        const val = _val.filter(Boolean)
        if (!stories) return resolve(val)
        for (let i = 0; i < val.length; i++) {
          state[stories][i + from] = val[i]
        }
        resolve(val)
      })
    })
  },
  nuxtServerInit(_, { params, error, route, redirect }) {
    if (route.path[1] === 's') {
      // stands for "starred" route
      if (route.path[3] === 's') return
      const whitelist = [undefined, 'new', 'top', 'best']
      const idxStories = whitelist.indexOf(params.stories)
      if (idxStories === -1) return error(404)
    } else if (route.path[1] === 'u') {
      if (!params.id) return error('404 need to specify user id')
    } else if (route.path[1] === 'i') {
      if (!params.id) return error('404 need to specify item id')
    } else redirect('/s')
  },
}

export const strict = false

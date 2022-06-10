import axios from 'axios'

export default {
  namespaced: true,

  state: {
    token: null,
    user: null,
    errorMessage: null,
  },

  getters: {
    authenticated(state) {
      return state.token && state.user
    },

    userInitials: state => {
      return `${state.user.name[0]}${state.user.surname[0]}`
    },

    isAdmin(state) {
      return state.user.isAdmin
    },

    errorMessage(state) {
      return state.errorMessage
    },
  },
  
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER(state, data) {
      state.user = data
    },
    SET_ERROR(state, errText) {
      state.errorMessage = errText
    }
  },

  actions: {
    
    async signIn({ dispatch, commit }, credentials) {
      let response = await axios.post('/', {RFI: 1, email: credentials.email, pass: credentials.password})
      
      if (response.data.RC == 0) {
        dispatch('attempt', response.data.token)
        commit('SET_ERROR', null)
      } else {
        console.log(response.data.__ERR)
        commit('SET_ERROR', response.data.__ERR)
      }
    },

    async attempt({ commit }, token) {
      if (token) {
        commit('SET_TOKEN', token)
      }
      
      let response = await axios.post('/', {RFI: 3, token: localStorage.getItem('token')})
      if (response.data.RC == 0) {
        commit('SET_USER', {name: response.data.name, surname: response.data.surname, email: response.data.email, isAdmin: response.data.isAdmin})
      } else {
        console.log(response.data.__ERR)
        commit('SET_TOKEN', null)
        commit('SET_USER', null)
        // localStorage.removeItem('token')
      }          
    },

    async logOut({ commit }) {
      await axios.post('/', {RFI: 4, token: localStorage.getItem('token')})
      commit('SET_TOKEN', null)
      commit('SET_USER', null) 
      // if (response.data.RC == 0) {
      //   commit('SET_TOKEN', null)
      //   commit('SET_USER', null)        
      // } else {
      //   console.log(response.data.__ERR)
      // }
     }
  } 
}

// export default {
//   namespaced: true,

//   state: {
//     token: null,
//     user: null,
//   },

//   getters: {
//     authenticated(state) {
//       return state.token && state.user
//     },
//     user(state) {
//       return state.user
//     }
//   },
  
//   mutations: {
//     SET_TOKEN(state, token) {
//       state.token = token
//     },
//     SET_USER(state, data) {
//       state.user = data
//     }
//   },

//   actions: {
//     async signIn({ dispatch }, credentials) {
//       let response = await axios.post('/', {RFI: 1, email: credentials.email, pass: credentials.password})
//       if (response.data.RC == 0) {
//         dispatch('attempt', response.data)
//       } else {
//         console.log(response.data.__ERR)
//       }
//     },
//     async attempt({ commit }, resData) {
//       commit('SET_TOKEN', resData.token)
//       commit('SET_USER', {name: resData.name, surname: resData.surname})
//     }
//   }

  
// }
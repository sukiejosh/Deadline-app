import Api from '@/services/Api'

export default {
  // AuthService.register({ params })
  register (credentials) {
    return Api().post('register', credentials)
  },
  // AuthService.login({ params })
  login (credentials) {
    return Api().post('login', credentials)
  },
  // AuthService.getUser(this.$store.state.token)
  getUser (token) {
    return Api().post('getUser', token)
  }
}

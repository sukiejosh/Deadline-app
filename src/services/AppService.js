import Api from '@/services/Api'

export default {
  // AppService.getPosts()
  getClients () {
    return Api().get('getClients')
  },
  // AppService.newPost({ postParams })
  newClient (post) {
    return Api().post('/newClient', post)
  },
  // AppService.showPost({ postId })
  showClient (params) {
    return Api().get('client/' + params.id)
  },
  // AppService.editPost({ postParams })
  editClient (client) {
    return Api().put('client/' + client.id, client)
  }
}

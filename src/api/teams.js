import axios from './interceptor'

const teamsResource = '/api/teams'

export default {
    index () {
        return axios.get(teamsResource)
    },
    store (data) {
        return axios.post(teamsResource, data)
    },
    patch (id, data) {
        return axios.patch(teamsResource + '/' + id, data)
    },
    show(id) {
        return axios.get(teamsResource + '/' + id)
    },
    delete(id) {
        return axios.delete(teamsResource + '/' + id)
    },
    revert() {
        return axios.get(teamsResource + '/revert')
    }
}

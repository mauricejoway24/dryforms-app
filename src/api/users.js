import axios from './interceptor'

const usersResource = '/api/users'

export default {
    index(data) {
        return axios.get(usersResource, {
            params: data
        })
    },
    store(data) {
        return axios.post(usersResource, data)
    },
    patch(id, data) {
        return axios.patch(usersResource + '/' + id, data)
    },
    show(id) {
        return axios.get(usersResource + '/' + id)
    },
    delete(id) {
        return axios.delete(usersResource + '/' + id)
    }
}
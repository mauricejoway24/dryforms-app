import axios from './interceptor'

const structuresResource = '/api/standard/structures'

export default {
    index (data) {
        return axios.get(structuresResource, {params: data})
    },
    store (data) {
        return axios.post(structuresResource, data)
    },
    patch (id, data) {
        return axios.patch(structuresResource + '/' + id, data)
    },
    show(id) {
        return axios.get(structuresResource + '/' + id)
    },
    delete(id) {
        return axios.delete(structuresResource + '/' + id)
    },
    revert() {
        return axios.get(structuresResource + '-revert')
    }
}

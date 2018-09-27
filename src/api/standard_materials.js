import axios from './interceptor'

const materialsResource = '/api/standard/materials'

export default {
    index (data) {
        return axios.get(materialsResource, {params: data})
    },
    store (data) {
        return axios.post(materialsResource, data)
    },
    patch (id, data) {
        return axios.patch(materialsResource + '/' + id, data)
    },
    show(id) {
        return axios.get(materialsResource + '/' + id)
    },
    delete(id) {
        return axios.delete(materialsResource + '/' + id)
    },
    revert() {
        return axios.get(materialsResource + '-revert')
    }
}

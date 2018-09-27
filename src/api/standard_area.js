import axios from './interceptor'
const areasResource = '/api/areas'

export default {
    index (data) {
        return axios.get(areasResource, {params: data})
    },
    store (data) {
        return axios.post(areasResource, data)
    },
    patch (id, data) {
        return axios.patch(areasResource + '/' + id, data)
    },
    show(id) {
        return axios.get(areasResource + '/' + id)
    },
    delete(id) {
        return axios.delete(areasResource + '/' + id)
    },
    restore() {
        return axios.get(areasResource + '/restore')
    }
}

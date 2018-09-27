import axios from './interceptor'

const standardFormResource = '/api/standard/forms'

export default {
    index (data) {
        return axios.get(standardFormResource, {params: data})
    },
    store (data) {
        return axios.post(standardFormResource, data)
    },
    patch (id, data) {
        return axios.patch(standardFormResource + '/' + id, data)
    },
    show (id) {
        return axios.get(standardFormResource + '/' + id)
    },
    delete (id) {
        return axios.delete(standardFormResource + '/' + id)
    },
    storeStatement (data) {
        return axios.post('/api/standard/statement', data)
    },
    deleteStatement (id) {
        return axios.delete('/api/standard/statement' + '/' + id)
    }
}

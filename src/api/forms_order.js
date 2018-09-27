import axios from './interceptor'

const formsOrderResource = '/api/standard/form_orders'

export default {
    index (data) {
        return axios.get(formsOrderResource, {params: data})
    },
    store (data) {
        return axios.post(formsOrderResource, data)
    },
    patch (id, data) {
        return axios.patch(formsOrderResource + '/' + id, data)
    },
    show(id) {
        return axios.get(formsOrderResource + '/' + id)
    },
    delete(id) {
        return axios.delete(formsOrderResource + '/' + id)
    }
}

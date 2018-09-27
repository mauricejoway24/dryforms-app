import axios from './interceptor'

const reviewRequestMessageResource = '/api/review-request-message'

export default {
    index (data) {
        return axios.get(reviewRequestMessageResource, {params: data})
    },
    store (data) {
        return axios.post(reviewRequestMessageResource, data)
    },
    patch (id, data) {
        return axios.patch(reviewRequestMessageResource + '/' + id, data)
    },
    show(id) {
        return axios.get(reviewRequestMessageResource + '/' + id)
    },
    delete(id) {
        return axios.delete(reviewRequestMessageResource + '/' + id)
    }
}

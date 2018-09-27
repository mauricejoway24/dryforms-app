import axios from './interceptor'

const reviewLinksResource = '/api/review-links'

export default {
    index (data) {
        return axios.get(reviewLinksResource, {params: data})
    },
    store (data) {
        return axios.post(reviewLinksResource, data)
    },
    patch (id, data) {
        return axios.patch(reviewLinksResource + '/' + id, data)
    },
    show(id) {
        return axios.get(reviewLinksResource + '/' + id)
    },
    delete(id) {
        return axios.delete(reviewLinksResource + '/' + id)
    }
}

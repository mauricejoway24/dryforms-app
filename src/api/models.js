import axios from './interceptor';
const modelRoute = '/api/models';

export default {
    index() {
        return axios.get(modelRoute)
    },

    pageNumberIndexed(pageno) {
        return axios.get(modelRoute + "?page=" + pageno)
    },

    category_based(category_id) {
        return axios.get(modelRoute + "?category_id=" + category_id);
    },

    store(data) {
        return axios.post(modelRoute, data)
    },

    patch(id, data) {
        return axios.patch(modelRoute + "/" + id, data)
    },

    show(id) {
        return axios.get(modelRoute + '/' + id)
    },

    delete(id) {
        return axios.delete(modelRoute + "/" + id)
    }
}

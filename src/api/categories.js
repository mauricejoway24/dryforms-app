import axios from './interceptor';
const categorieResources = '/api/categories';

export default {
    index() {
        return axios.get(categorieResources)
    },
    pageNumberIndex(pageno) {
        return axios.get(categorieResources + "?page="+pageno)
    },
    show(id) {
        return axios.get(categorieResources + "/" + id)
    },
    store(data) {
        return axios.post(categorieResources, data)
    },
    patch(id, data) {
        if (!id) {
            return this.store(data)
        } else {
            return axios.patch(categorieResources + "/" + id, data)
        }
    },
    delete(id) {
        return axios.delete(categorieResources + "/" + id)
    }
}

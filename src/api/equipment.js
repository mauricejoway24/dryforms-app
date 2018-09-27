import axios from './interceptor';
const equipmentResource = '/api/equipment';

export default {
    index() {
        return axios.get(equipmentResource)
    },

    pageNumber(pageno) {
        return axios.get(equipmentResource + "?page="+ pageno)
    },
    store(data) {
        return axios.post(equipmentResource,  data)
    },
    patch (id, data) {
        return axios.patch(equipmentResource + "/" + id, data)
    },
    show(id) {
        return axios.get(equipmentResource + "/" + id)
    },
    delete(id) {
        return axios.delete(equipmentResource + "/" + id)
    }
}


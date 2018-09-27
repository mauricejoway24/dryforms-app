import axios from './interceptor'
const companiesResource = '/api/companies'

export default {
    store(data) {
        return axios.post(companiesResource, data)
    },
    storeLogo(id, data) {
        return axios.post(companiesResource + '/' + id + '/logo', data)
    },
    removeLogo(id) {
        return axios.delete(companiesResource + '/' + id + '/logo')
    },
    patch(id, data) {
        if (!id) {
            return this.store(data)
        } else {
            return axios.patch(companiesResource + '/' + id, data)
        }
    },
    show(id) {
        return axios.get(companiesResource + '/' + id)
    },
    setIdentifier(id) {
        return axios.get(companiesResource + '/identifier/' + id)
    }
}
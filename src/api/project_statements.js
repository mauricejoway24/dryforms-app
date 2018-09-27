import axios from './interceptor'

const projectStatementsResource = '/api/project/statement'

export default {
    update (id, data) {
        return axios.patch(projectStatementsResource + '/' + id, data)
    },
    check(data) {
        return axios.post('/api/project-statement/check', data)
    },
    revert(id, data) {
        return axios.post(projectStatementsResource + '/revert/' + id, data)
    }
}

import axios from './interceptor'

const standardDailylogSettings = '/api/standard/dailylog_settings'

export default {
    index (data) {
        return axios.get(standardDailylogSettings, {params: data})
    },
    store (data) {
        return axios.post(standardDailylogSettings, data)
    },
    patch (id, data) {
        return axios.patch(standardDailylogSettings + '/' + id, data)
    },
    show(id) {
        return axios.get(standardDailylogSettings + '/' + id)
    },
    delete(id) {
        return axios.delete(standardDailylogSettings + '/' + id)
    }
}

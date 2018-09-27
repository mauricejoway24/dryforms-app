import axios from './interceptor'
const passwordRoute = '/api/account/password/change'
const emailRoute = '/api/account/email/change'
const userInfoRoute = '/api/account'
const subscribeRoute = '/api/account/subscribe'
const cancelSubscriptionRoute = '/api/account/subscription/cancel'
const resumeSubscriptionRoute = '/api/account/subscription/resume'
const getInvoicesRoute = '/api/account/get-invoices'
const updateSource = '/api/account/credit-card/update'

export default ApiAccount = {
    changeEmail(data) {
        return axios.post(emailRoute, data)
    },
    changePassword(data) {
        return axios.post(passwordRoute, data)
    },
    userInformation() {
        return axios.get(userInfoRoute)
    },
    subscribe(data) {
        return axios.post(subscribeRoute, data)
    },
    cancelSubscription(data) {
        return axios.post(cancelSubscriptionRoute, {
            params: data
        })
    },
    resumeSubscription(data) {
        return axios.get(resumeSubscriptionRoute, {
            params: data
        })
    },
    getInvoices(data) {
        return axios.get(getInvoicesRoute, {
            params: data
        })
    },
    updateSource(data) {
        return axios.post(updateSource, data)
    }
}
import {
    FETCH_USER,
    FETCH_COMPANY,
    FETCH_SUBSCRIPTION
} from './actionTypes'

export const setUser = (user) => {
    return {
        type: FETCH_USER,
        user: user
    }
}

export const setCompany = (company) => {
    return {
        type: FETCH_COMPANY,
        company: company
    }
}

export const setSubscription = (subscription) => {
    return {
        type: FETCH_SUBSCRIPTION,
        subscription: subscription
    }
}
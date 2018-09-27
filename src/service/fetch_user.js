import ApiAccount from '../api/account'
import {
    logoutRequest
} from '../actions/auth'

import {
    setUser,
    setCompany,
    setSubscription
} from '../actions/user'

import {
    AsyncStorage
} from "react-native"

export function fetchUser() {
    return dispatch => {
        return ApiAccount.userInformation()
            .then(response => {
                dispatch(setUser(response.data.user))
                dispatch(setCompany(response.data.company))
                dispatch(setSubscription({
                    isSubscribed: response.data.isSubscribed,
                    isGracePeriod: response.data.isGracePeriod
                }))
            })
            .catch(response => {
                dispatch(logoutRequest())
            })
    }
}
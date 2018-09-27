import ApiFormsOrder from '../api/forms_order'
import {
    logoutRequest
} from '../actions/auth'

import {
    setFormsOrder
} from '../actions/standard_form'

import {
    AsyncStorage
} from "react-native"

export function fetchFormsOrder() {
    return dispatch => {
        return ApiFormsOrder.index()
            .then(response => {
                dispatch(setFormsOrder(response.data))
            })
            .catch(response => {
                dispatch(logoutRequest())
            })
    }
}
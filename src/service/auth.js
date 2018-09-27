import {
    loginSuccess,
    loginError,
    logoutRequest
} from '../actions/auth'
import {
    AsyncStorage
} from "react-native";

import apiAuth from '../api/auth'

/* export function login(userData) {
    SInfo.deleteItem('TOKEN',  {})
    return dispatch => {
        return apiAuth.login(userData)
            .then(response => {
                if (response.data.token) {
                    SInfo.setItem('TOKEN', response.data.token, {})
                        .then(() => {
                            dispatch(loginsuccess(userData, response.data));
                        })
                        .catch(err => {
                            let error = 'Whoops! Something went wrong';
                            console.error(error)
                            dispatch(loginError(error))
                        })
                } else {
                    let error = 'The credentials you entered are incorrect.'
                    console.error(error)
                    dispatch(loginError(error))
                }
            }).catch(err => {
                let error = 'Whoops! Something wrong'
                console.error(error)
                dispatch(loginError(error))
            })
    }
} */

export function login(userData) {
    AsyncStorage.removeItem('TOKEN')
    return dispatch => {
        return apiAuth.login(userData)
            .then(response => {
                if (response.data.token) {
                    AsyncStorage.setItem('TOKEN', response.data.token, () => {
                        dispatch(loginSuccess(userData, response.data))
                    }, (err) => {
                        let error = 'Whoops! Something wrong'
                        console.error(error)
                        dispatch(loginError(error))
                    });
                } else {
                    let error = 'The credentials you entered are incorrect.'
                    console.error(error)
                    dispatch(loginError(error))
                }
            })
            .catch(response => {
                let error = 'Whoops! Something wrong'
                console.error(error)
                dispatch(loginError(error))
            })
    }
}

export function logout() {
    return dispatch => {
        dispatch(logoutRequest())
    }
}

import {
    LOGGED_SUCCESSFULLY,
    LOGGED_FAILED,
    LOGOUT,
    LOGGING_ATTEMPT
} from '../actions/actionTypes'
import {
    AsyncStorage
} from "react-native"

const initialState = {
    email: '',
    password: '',
    token: '',
    isLoggingIn: false,
    isLoggedIn: false,
    error: null
}

export default function auth(state = initialState, action) {
    switch (action.type) {
        case LOGGED_SUCCESSFULLY:
            return Object.assign({}, state, {
                isLoggingIn: false,
                isLoggedIn: true,
                error: null,
                email: action.user.email,
                password: action.user.password,
                token: action.response.token
            });
        case LOGGED_FAILED:
            return Object.assign({}, state, {
                error: action.error,
                isLoggingIn: false,
                isLoggedIn: false,
                email: '',
                password: '',
                token: ''
            });
        case LOGGING_ATTEMPT:
            return Object.assign({}, state, {
                isLoggingIn: true,
                isLoggedIn: false,
                email: '',
                password: '',
                error: null,
                token: ''
            });
            break;
        case LOGOUT:
            AsyncStorage.removeItem('TOKEN')
            return Object.assign({}, state, {
                isLoggedIn: false,
                isLoggingIn: false,
                email: '',
                password: '',
                error: '',
                token: ''
            });
        default:
            return state;
    }
}
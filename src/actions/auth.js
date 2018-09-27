import { LOGGED_SUCCESSFULLY, LOGGED_FAILED, LOGOUT, LOGGING_ATTEMPT } from './actionTypes'

export const loginAttempt = (userData) => {
    return {
        type: LOGGING_ATTEMPT,
        user: userData
    }
}

export function loginSuccess(userData, response) {
    return {
        response,
        user: userData,
        type: LOGGED_SUCCESSFULLY
    };
}

export function loginError(error) {
    return {
        error,
        type: LOGGED_FAILED
    };
}

export function logoutRequest() {
    return {
        type: LOGOUT
    };
}
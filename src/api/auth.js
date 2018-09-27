import {
    API_DOMAIN
} from '../../config/env'
import axios from 'axios';

const loginRoute = API_DOMAIN + '/api/login';
const registerRoute = API_DOMAIN + '/api/register'
const refreshRoute = API_DOMAIN + '/api/refresh'
const logoutRoute = API_DOMAIN + '/api/logout'
const setPasswordRoute = API_DOMAIN + '/api/set-password'

export default {
    login(data) {
        return axios.post(loginRoute, data)
    },
    refresh(oldAuthorization) {
        return axios.get(refreshRoute, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': oldAuthorization
            }
        })
    },
    register(data) {
        return axios.post(registerRoute, data)
    },
    logout() {
        return axios.post(logoutRoute)
    },
    setPassword(data) {
        return axios.post(setPasswordRoute, data)
    }
}
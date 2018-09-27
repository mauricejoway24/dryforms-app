import axios from 'axios'
import {
    API_DOMAIN
} from '../../config/env'
import {
    AsyncStorage
} from "react-native"
import auth from './auth'

const AxiosInstance = axios.create({
    baseURL: API_DOMAIN,
    timeout: 20000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

AxiosInstance.interceptors.request.use(async config => {
    let token = await AsyncStorage.getItem('TOKEN');
    config.headers['Authorization'] = 'Bearer ' + token
    return config
    /*  SInfo.getItem('TOKEN', {})
      .then(token => {
          config.headers['Authorization'] = ' Bearer ' + token
          return config
      }).catch(err => {
          return err;
      }) */
}, error => {
    return Promise.reject(error)
})

AxiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    debugger
    let res = error.response

    const originalRequest = error.config;
    if (!error.response) {
        return Promise.reject('Network Error')
    } else if ((error.response.status === 401) && !originalRequest._retry) {
        let tokenRefreshAt = await AsyncStorage.getItem('TOKEN_REFRESH_AT');
        if (!tokenRefreshAt || (new Date().getTime() - tokenRefreshAt > 1000 * 60 * 5)) {
            originalRequest._retry = true;
            return auth.refresh(originalRequest.headers['Authorization'])
                .then(response => {
                    const token = response.data.token;
                    AxiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    originalRequest._retry = false;
                    /* SInfo.setItem('TOKEN', token, {})
                        .then(() => {
                            return axios(originalRequest);
                        })
                        .catch(err => {
                            return err;
                        }) */

                    AsyncStorage.setItem('TOKEN', token, () => {}, (err) => {
                        return Promise.reject(err)
                    });
                    AsyncStorage.setItem('TOKEN_REFRESH_AT', new Date().getTime(), () => {}, (err) => {
                        return Promise.reject(err)
                    })
                    return Promise.resolve(axios(originalRequest));
                })
                .catch(err => {
                    return Promise.reject(err)
                })
        } else {
            let token = await AsyncStorage.getItem('TOKEN');
            AxiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            originalRequest._retry = false;
            return Promise.resolve(axios(originalRequest));
        }
    } else if (error.response.status === 422) {
        return Promise.reject(res)
    } else {
        return Promise.reject(res)
    }

})

export default AxiosInstance
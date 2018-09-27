import ApiModel from '../api/models';
import {
    fetchModels,
    showModels,
    storeModel,
    updateModel,
    deleteModel
} from '../actions/model';

export function allModels() {
    return dispatch => {
        return ApiModel.fetchModels()
            .then(response => {
                dispatch(fetchModels(response.data.data))
            })
            .catch(err => {
                dispatch(fetchModels(undefined));
            })
    }
}

export function displayModel(id) {
    return dispatch => {
        return ApiModel.show(id)
            .then(response => {
                dispatch(showModels(response.data.data))
            })
            .catch(err => {
                dispatch(showModels(undefined))
            })
    }
}

export function addModel(data) {
    return dispatch => {
        return ApiModel.store(data)
            .then(response => {
                dispatch(storeModel(response.data.data));
            })
            .catch(err => {
                dispatch(storeModel(undefined))
            })
    }
}

export function modelUpdate(id, data) {
    return dispatch => {
        return ApiModel.patch(id, data)
            .then(response => {
                dispatch(updateModel(response.data.data));
            })
            .catch(err => {
                dispatch(updateModel(undefined));
            })
    }
}

export function modelDelete(id) {
    return dispatch => {
        return ApiModel.delete(id)
            .then(response => {
                dispatch(deleteModel(response.data.data));
            })
            .catch(err => {
                dispatch(deleteModel(undefined));
            })
    }
}





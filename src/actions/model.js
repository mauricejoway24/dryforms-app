import {
    FETCH_MODELS,
    SHOW_MODELS,
    STORE_MODELS,
    UPDATE_MODELS,
    DELETE_MODELS
} from './actionTypes';


export const fetchModels = (models) => {
    return {
        type: FETCH_MODELS,
        models: models
    }
}

export const showModels = (models) => {
    return {
        type: SHOW_MODELS,
        models: models
    }
}

export const storeModel = (models) => {
    return {
        type: STORE_MODELS,
        models: models
    }
}

export const updateModel = (model) => {
    return {
        type: UPDATE_MODELS,
        model: model
    }
}

export const deleteModel = (model) => {
    return {
        type: DELETE_MODELS,
        model: model
    }
}

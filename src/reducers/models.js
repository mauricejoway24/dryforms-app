import {
    FETCH_MODELS,
    SHOW_MODELS,
    STORE_MODELS,
    UPDATE_MODELS,
    DELETE_MODELS
} from '../actions/actionTypes';


const initialState = {
    models: [],
    model: {},
    storedModel: {},
    updatedModel: {},
    deletedModel: {}
}

export default function models(state = initialState, action) {
    switch(action.type) {
        case FETCH_MODELS:
            return Object.assign({}, state, {
                models: action.models
            });
        case SHOW_MODELS:
            return Object.assign({}, state, {
                model: action.model
            });
        case STORE_MODELS:
            return Object.assign({}, state, {
                storedModel: action.model
            })
        case UPDATE_MODELS:
            return Object.assign({}, state,  {
                updatedModel: action.model
            })
        case DELETE_MODELS:
            return Object.assign({}, state, {
                deletedModel: action.model
            })
        default:
            return state;
    }
}


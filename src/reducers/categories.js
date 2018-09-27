import {
    FETCH_CATEGORIES,
    SHOW_CATEGORIES,
    STORE_CATEGORIES,
    UPDATE_CATEGORIES,
    DELETE_CATEGORIES
} from '../actions/actionTypes';

const initialState = {
    categories: [],
    category: {},
    storedCategory: {},
    updatedCategory: {},
    deletedCategory: {}
}

export default function categories(state = initialState, action) {
    switch(action.type) {
        case FETCH_CATEGORIES:
            return Object.assign({}, state, {
                categories: action.categories
            });
        case SHOW_CATEGORIES:
            return Object.assign({}, state, {
                category: action.category
            });
        case STORE_CATEGORIES:
            return Object.assign({}, state, {
                storedCategory: action.category
            })
        case UPDATE_CATEGORIES:
            return Object.assign({}, state, {
                updatedCategory: action.category
            })
        case DELETE_CATEGORIES:
            return Object.assign({}, state, {
                deletedCategory: action.category
            })
        default:
            return state;
    }
}


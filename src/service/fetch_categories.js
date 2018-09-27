import ApiCategories from '../api/categories';
import {
    fetchCategories,
    showCategories,
    storeCategory,
    updateCategory,
    deleteCategory
} from '../actions/categories.js';

export function allCategories() {
    return dispatch => {
        return ApiCategories.index()
            .then(response => {
                dispatch(fetchCategories(response.data.data));
            })
            .catch(err => {
                dispatch(fetchCategories(undefined));
            })
    }
}

export function displayCategories(id) {
    return dispatch => {
        return ApiCategories.show(id)
            .then(response => {
                dispatch(showCategories(response.data.data));
            })
            .catch(err => {
                dispatch(showCategories(undefined))
            })
    }
}


export function insertCategories(data){
    return dispatch => {
        return ApiCategories.store(data)
            .then(response => {
                dispatch(storeCategory(response.data.data))
            })
            .catch(err => {
                dispatch(storeCategory(undefined))
            })
    }
}

export function categoryUpdate(id, data) {
    return dispatch => {
        return ApiCategories.patch(id, data)
            .then(response => {
                dispatch(updateCategory(response.data.data));
            })
            .catch(err => {
                dispatch(updateCategory(undefined));
            })
    }
}

export function categoryDelete(id) {
    return dispatch => {
        return ApiCategories.delete(id)
            .then(response => {
                dispatch(deleteCategory(response.data.data))
            })
            .catch(err => {
                dispatch(deleteCategory(undefined))
            })
    }
}

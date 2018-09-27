import {
    FETCH_CATEGORIES, 
    SHOW_CATEGORIES,
    STORE_CATEGORIES,
    UPDATE_CATEGORIES,
    DELETE_CATEGORIES
} from './actionTypes';


export const fetchCategories = (categories) => {
    return {
        type: FETCH_CATEGORIES,
        categories: categories
    }
};

export const showCategories = (categories) => {
    return {
        type: SHOW_CATEGORIES,
        categories: categories
    }
}

export const storeCategory = (category) => {
    return {
        type: STORE_CATEGORIES,
        category: category
    }
}

export const updateCategory = (category) => {
    return {
        type: UPDATE_CATEGORIES,
        category: category
    }
}

export const deleteCategory = (category) => {
    return {
        type: DELETE_CATEGORIES,
        category: category
    }
}

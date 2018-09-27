import {
    SET_FORMS_ORDER
} from '../actions/actionTypes'

const initialState = {
    formsOrder: []
}

export default function standard_form(state = initialState, action) {
    switch (action.type) {
        case SET_FORMS_ORDER:
            return Object.assign({}, state, {
                formsOrder: action.formsOrder
            });
        default:
            return state;
    }
}
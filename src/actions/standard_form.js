import { SET_FORMS_ORDER } from './actionTypes'

export const setFormsOrder = (formsOrder) => {
    return {
        type: SET_FORMS_ORDER,
        formsOrder: formsOrder
    }
}
import {
    FETCH_INVENTORY,
    SHOW_INVENTORY,
    STORE_INVENTORY
} from '../actions/actionTypes';


const initialState = {
    inventories: [],
    inventory: {},
    inventory: {},
}

export default function equipment(state = initialState, action) {
    switch(action.type) {
        case FETCH_INVENTORY:
            return Object.assign({}, state, {
                inventories: action.inventories
            });
        case SHOW_INVENTORY:
            return Object.assign({}, state, {
                inventory: action.inventory
            });
        case STORE_INVENTORY:
            return Object.assign({}, state, {
                inventory: action.inventory
            })
        default:
            return state;
    }
}

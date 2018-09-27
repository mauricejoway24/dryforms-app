import {
    FETCH_INVENTORY, 
    SHOW_INVENTORY, 
    STORE_INVENTORY
} from './actionTypes';

export const fetchInventory = (inventories) => {
    return {
        type: FETCH_INVENTORY,
        inventory: inventory
    }
}

export const showInventory = (inventory) => {
    return {
        type: SHOW_INVENTORY,
        inventory: inventory
    }
}

export const storeInventory = (inventory) => {
    return {
        type: STORE_INVENTORY,
        inventory: inventory
    }
}

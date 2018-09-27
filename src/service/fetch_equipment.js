import ApiEquipment from '../api/equipment';
import {
    fetchInventory,
    showInventory,
    storeInventory
} from '../actions/equipments';


export function equipmentsPaged(pageno) {
    return dispatch => {
        return ApiEquipment.pageNumber(pageno)
            .then(response => {
                dispatch(fecthInventory(response.data.data));
            })
            .catch(err => {
                dispatch(fecthInventory(undefined));
            })
    }
}

export function allEquipments() {
    return dispatch => {
        return ApiEquipment.index()
            .then(response => {
                dispatch(fetchInventory(response.data.data));
            })
            .catch(err => {
                dipatch(fetchInventory(undefined));
            })
    }
}

export function displayEquipment(id) {
    return dispatch => {
        return ApiEquipment.show(id)
            .then(response => {
                dispatch(showInventory(response.data.data));
            })
            .catch(err => {
                dispatch(showInventory(undefined));
            })
    }
}

export function insertEquipment(data) {
    return dispatch => {
        return ApiEquipment.store(data)
            .then(response => {
                dispatch(storeInventory(response.data.data))
            })
            .catch(error => {
                dispatch(storeInventory(undefined))
            })
    }
}

import {
    HEADER_TITLE,
    SIDEBAR_MENUS,
    SIDEBAR_INVISIBLE
} from '../actions/actionTypes'

const initialState = {
    headerTitle: '',
    sideBarMenus: [],
    sideBarInvisible: false
}

export default function shared(state = initialState, action) {
    switch (action.type) {
        case HEADER_TITLE:
            return Object.assign({}, state, {
                headerTitle: action.headerTitle
            });
        case SIDEBAR_MENUS:
            return Object.assign({}, state, {
                sideBarMenus: action.sideBarMenus
            });
        case SIDEBAR_INVISIBLE:
            return Object.assign({}, state, {
                sideBarInvisible: action.sideBarInvisible
            });
        default:
            return state;
    }
}
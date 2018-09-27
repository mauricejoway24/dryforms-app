import { HEADER_TITLE, SIDEBAR_MENUS, SIDEBAR_INVISIBLE } from './actionTypes'

export const changeHeaderTitle = (headerTitle) => {
    return {
        type: HEADER_TITLE,
        headerTitle: headerTitle
    }
}

export const changeSideBarMenus = (sideBarMenus) => {
    return {
        type: SIDEBAR_MENUS,
        sideBarMenus: sideBarMenus
    }
}

export const changeSideBarInivisble = (sideBarInvisible = false) => {
    return {
        type: SIDEBAR_INVISIBLE,
        sideBarInvisible: sideBarInvisible
    }
}
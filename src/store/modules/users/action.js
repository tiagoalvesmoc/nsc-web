import types from "./types";


export function allUsers() {

    return { type: types.SET_USERS }

}

export function updateUsers(payload) {

    return { type: types.SET_USERS, payload }

}




export function requestAllUser(payload) {

    return { type: types.GET_ALL_USERS, payload }

}
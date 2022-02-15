import types from "./types";

export function login(payload) {

    return { type: types.USER_LOGIN, payload }

}

export function updateForm(payload) {

    return { type: types.UPDATE_FORM, payload }

}


export function requestUsers() {

    return { type: types.REQUEST_USER }

}

export function setAlUsers(payload) {

    return { type: types.SET_ALL_USERS, payload }

}
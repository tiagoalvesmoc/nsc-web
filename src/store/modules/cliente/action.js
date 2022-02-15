import types from "./types"

export function allClientes() {

    return { type: types.ALL_CLIENTES }
}

export function updateClientes(clientes) {

    return { type: types.UPDATE_CLIENTE, clientes }
}

export function createNewUser(cliente) {

    return { type: types.CREATE_NEW_USER, cliente }
}

export function filterCliente() {

    return { type: types.FILTER_CLIENTE }
}

export function addCliente() {

    return { type: types.ADD_CLIENTE }
}
export function resetCliente() {

    return { type: types.RESET_CLIENT }
}

export function unlinkCliente() {

    return { type: types.UNLINK_CLIENTE }
}


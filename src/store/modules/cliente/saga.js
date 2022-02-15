import { takeLatest, all, call, put, select } from 'redux-saga/effects'


import { updateClientes, allClientes as allClientesAction, resetCliente } from './action'

import types from './types'

import api from '../../../services/api'


export function* allClientes() {

    const { form } = yield select(state => state.cliente)


    try {

        yield put(updateClientes({ form: { ...form, filtering: true } }))
        const res = yield call(api.get, '/usuarios')

        if (res.error) {
            alert(res.message)
            return false
        }
        yield put(updateClientes({ form: { ...form, filtering: false } }))
        yield put(updateClientes({ clientes: res.data.all_users }))

    } catch (error) {
        yield put(updateClientes({ form: { ...form, filtering: false } }))
        alert(error.message)

    }
}


export function* filterClientes() {

    const { form, cliente } = yield select(state => state.cliente)


    try {

        yield put(updateClientes({ form: { ...form, filtering: true } }))
        const res = yield call(api.post, '/usuarios/filter',
            {

                filters: {
                    email: cliente.email,
                    status: 'A'
                }
            })


        if (res.error) {
            alert(res.message)
            return false
        }
        if (res.data.clientes) {

            console.log("RES ->", res)
            yield put(updateClientes({
                cliente: res.data.clientes[0],
                form: { ...form, filtering: false, disabled: false }


            }))

        } else {
            yield put(updateClientes({
                cliente: { ...cliente, email: cliente.email }
            }))
            yield put(updateClientes({ form: { ...form, disabled: false, filtering: false } }))

        }





    } catch (error) {
        yield put(updateClientes({ form: { ...form, filtering: false } }))
        alert(error.message)

    }
}


export function* addClientes() {

    const { form, cliente, components } = yield select(state => state.cliente)


    try {

        yield put(updateClientes({ form: { ...form, saving: true } }))
        const res = yield call(api.post, '/usuarios/add', {
            cliente
        })

        yield put(updateClientes({ form: { ...form, saving: false } }))


        if (res.error) {
            alert(res.message)

            return false
        }

        yield put(allClientesAction())
        yield put(updateClientes({ components: { ...components, drawer: false } }))
        yield put(resetCliente())

    } catch (error) {

        alert(error.message)

    }
}


export function* unlinkCliente() {

    const { form, cliente, components } = yield select(state => state.cliente)


    try {

        yield put(updateClientes({ form: { ...form, saving: true } }))
        const res = yield call(api.post, '/usuarios/remove', {
            cliente
        })

        yield put(updateClientes({ form: { ...form, saving: false } }))
        yield put(updateClientes({ components: { ...components, confirmDelete: false } }))


        if (res.error) {
            alert(res.message)

            return false
        }

        yield put(allClientesAction())
        yield put(updateClientes({ form: { ...form, saving: false } }))

        yield put(updateClientes({ components: { ...components, drawer: false, confirmDelete: false } }))
        yield put(resetCliente())

    } catch (error) {

        alert(error.message)

    }
}



export default all(
    [
        takeLatest(types.ALL_CLIENTES, allClientes),
        takeLatest(types.FILTER_CLIENTE, filterClientes),
        takeLatest(types.ADD_CLIENTE, addClientes),
        takeLatest(types.UNLINK_CLIENTE, unlinkCliente),
    ],
)
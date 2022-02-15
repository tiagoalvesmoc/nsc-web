import { takeLatest, all, call, put, select } from 'redux-saga/effects'


import { allUsers, updateUsers, requestAllUser } from './action'
import types from './types'

const axios = require('axios').default
import api from '../../../services/api'
import { axios } from 'axios'

const all_users = [
    { name: "tiago", email: "teste@teste.com" },
    { name: "khaleb", email: "teste@teste.com" },
    { name: "rebeca", email: "teste@teste.com" },
]


export function* getAllUsers() {

    try {

        const response = yield call(api.get, 'http://localhost:8000/usuarios');
        const res = yield call(axios.get, 'http://localhost:8000/usuarios');

        console.log('SAGAS ---->', response)
        if (response.error) {
            alert(response.message)
            return false
        }
        alert()
        yield put(updateUsers(response.all_users))

    } catch (error) {

        alert(error.message)

    }
}

export default all([

    takeLatest(types.GET_ALL_USERS, getAllUsers)
]);
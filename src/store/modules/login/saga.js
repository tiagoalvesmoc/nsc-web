import { takeLatest, all, call, put } from "redux-saga/effects";
import types from "./types";
import api from '../../../services/api'
import { setAlUsers } from "./action";



export function* requestUser() {

    const response = yield call(api.get, '/usuarios')
    const res = response.data

    console.log(res)

    alert('Ok')

    // yield put(setAlUsers(res.all_users))

}



export default all([

    takeLatest(types.REQUEST_USER, requestUser())
])
import { all, takeLatest, call, put, select } from 'redux-saga/effects'


import { updateForm, updateAgendamento } from './action'
import api from '../../../services/api'


import types from './types'




export function* filterAgendamento(start, end) {

    try {

        const res = yield call(api.post, 'agendamento/filter', {

            salaoId: "",
            periodo: {
                inicio: start,
                final: end
            },


        })
        if (res.error) {
            alert(res.message)
            return false

        }

        // yield put(updateAgendamento(res.agendamentos))

    } catch (error) {
        alert(error.message)


    }

}


export function* createAgendamento(payload) {

    const { form } = yield select(state => state.agendamento)


    try {

        yield put(updateForm())

        // yield put(updateForm({ form: { ...form, loading: true } }))

        alert('')
    } catch (error) {

        alert('')
    }


}



export default all(
    [
        takeLatest(types.FILTER_AGENDAMENTOS, filterAgendamento()),
        takeLatest(types.CREATE_AGENDAMENTO, createAgendamento()),
    ],
)
import { all } from "redux-saga/effects";

import clientes from '../modules/cliente/saga'
import agendamentos from "../modules/agendamento/sagas"
import login from '../modules/login/saga'


export default function* rootSaga() {


    return yield all([clientes, agendamentos, login]);
}
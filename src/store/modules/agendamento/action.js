import types from "./types";

export function filterAgendamento() {

    return { type: types.FILTER_AGENDAMENTOS }
}

export function updateAgendamento(payload) {
    return { type: types.UPDATE_AGENDAMENTOS, payload };
}





export function createAgendamento() {
    return { type: types.CREATE_AGENDAMENTO };
}

export function updateForm(payload) {
    return { type: types.UPDATE_FORM, payload };
}
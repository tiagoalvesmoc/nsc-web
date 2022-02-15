import types from "./types"
import producer from 'immer'


const INITIAL_STATE = {

    form: {
        loading: false
    }
}


function agendamento(state = INITIAL_STATE, action) {

    switch (action.type) {

        case types.UPDATE_AGENDAMENTOS: {

            return producer(state, (draft) => {

                draft = { ...draft, ...action.payload };
                return draft;
            })

        }

        case types.UPDATE_FORM: {

            return producer(state, (draft) => {

                draft.form = { ...draft.form, loading: true };
                return draft;
            })

        }


        default: return state
    }


}

export default agendamento
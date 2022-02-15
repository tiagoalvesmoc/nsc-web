import produce from "immer"

import types from '../login/types'


const INTIAL_STATE = {

    all_users: {},

    user: {
        // email: '',
        // password: ''
    },
    form: {
        disabled: false,
        loading: false
    }
}


function login(state = INTIAL_STATE, action) {

    switch (action.type) {
        case types.USER_LOGIN:
            return produce(state, (draft) => {

                draft.user = action.payload
            })


        case types.UPDATE_FORM:
            return produce(state, (draft) => {
                draft.form = action.payload
                // draft.form = { ...draft.form, ...action.payload }

            })


        default:
            return state
    }
}

export default login
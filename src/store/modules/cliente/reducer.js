import produce from "immer";
import types from "./types";


const INITIAL_STATE = {

    behavior: 'create',
    components: {
        drawer: false,
        confirmDelete: false,

    },
    form: {

        filtering: false,
        disabled: true,
        saving: false
    },

    cliente: {
        email: '',
        name: '',
        phone: '',
        birthday: '',
        sexo: 'M',
        documento: {
            tipo: 'cpf',
            numero: '',
        },
        endereco: {
            cidade: '',
            uf: '',
            cep: '',
            logradouro: '',
            numero: '',
            pais: 'BR',
        },
    },
    new_user: {},
    clientes: [],

}

function cliente(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.UPDATE_CLIENTE:
            return produce(state, (draft) => {

                draft = { ...draft, ...action.clientes }
                return draft

            })
        case types.ALL_CLIENTES:
            return state


        case types.CREATE_NEW_USER:
            return produce(state, (draft) => {

                // draft.new_user = { ...draft.new_user, ...action.cliente }
                draft.cliente = { ...draft.cliente, ...action.cliente }
                draft = { ...draft.form, disabled: false }
                return

            })

        case types.RESET_CLIENT:
            return produce(state, (draft) => {

                // draft.new_user = { ...draft.new_user, ...action.cliente }

                draft.cliente = INITIAL_STATE.cliente
                return draft

            })


        default: return state

    }
}

export default cliente
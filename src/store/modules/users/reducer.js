import produce from 'immer'

import types from './types'


const INTIAL_STATE = {
   clientes: [],
   users: []

}

function cliente(state = INTIAL_STATE, action) {

   switch (action.type) {
      case types.SET_USERS:
         return produce(state, (draft) => {
            // draft = { ...draft, ...action.payload }

            draft.clientes = action.payload

         })
      case types.GET_ALL_USERS:
         return produce(state, (draft) => {
            // draft = { ...draft, ...action.payload }

            draft.users = action.payload
            return draft
         })


      default: return state

   }

}

export default cliente
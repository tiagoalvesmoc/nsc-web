import { combineReducers } from 'redux';

import cliente from './cliente/reducer';

import agendamento from './agendamento/reducer';
import login from './login/reducer'

export default combineReducers({
  cliente,

  agendamento,
  login,
});

import { createStore, applyMiddleware } from "redux";
import rootSaga from "./modules/rootSagas";
import rootReducer from "./modules/rootReducer";

import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;

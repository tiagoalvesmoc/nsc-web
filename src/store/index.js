import { createStore, applyMiddleware } from "redux";
import rootSaga from "./modules/rootSagas";
import rootReducer from "./modules/rootReducer";

import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";


const sagaMiddleware = createSagaMiddleware()







const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__
    && window.__REDUX_DEVTOOLS_EXTENSION__()
    ?
    composeWithDevTools(applyMiddleware(sagaMiddleware))
    :
    applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)

export default store



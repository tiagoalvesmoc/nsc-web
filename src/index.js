import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import Routes from "./routes";

import store from "./store";

import NewSignIn from "./routes/NewSignIn";

import { AuthProvider, AuthContext } from "./context/auth";

ReactDOM.render(
  <Provider store={store}>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </Provider>,

  document.getElementById("root")
);

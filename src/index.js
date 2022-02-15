import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import Routes from "./routes";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import store from "./store";

import { AuthProvider } from "./context/auth";

ReactDOM.render(
  <Provider store={store}>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </Provider>,

  document.getElementById("root")
);

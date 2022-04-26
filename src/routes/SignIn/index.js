import React, { useState, useContext } from "react";
import {
  login,
  updateForm,
  requestUsers,
} from "../../store/modules/login/action";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../context/auth";

import logo from "../../assets/logo2.png";
import { Button } from "rsuite";

export default function SignIn() {
  const { login, loading } = useContext(AuthContext);
  const dispatch = useDispatch();

  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });
  const [form, setForm] = useState({
    loading: true,
    disabled: false,
  });
  //   const { form } = useSelector((state) => state.login);

  const goto = () => {
    // dispatch(requestUsers());
    login(userLogin.email, userLogin.password);
  };

  return (
    <div>
      {/* <div class="row align-items-start">
        <div className="col m-3">
          {" "}
          <img className="col" src={logo} alt="" width="100" height="80" />
        </div>
      </div> */}
      <div className="container-fluid d-flex justify-content-center">
        <main className="form-signin">
          <h2 className="h3 mb-3 fw-normal">Painel App</h2>

          <div className="form-floating">
            <input
              style={{ height: 45 }}
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={(e) =>
                setUserLogin({ ...userLogin, email: e.target.value })
              }
            />
            <label for="floatingInput">E-mail </label>
          </div>

          <div className="form-floating">
            <input
              style={{ height: 45 }}
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={(e) =>
                setUserLogin({ ...userLogin, password: e.target.value })
              }
            />
            <label for="floatingPassword">Password</label>
          </div>

          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div>
          <Button
            style={{ height: 45 }}
            color="black"
            loading={loading}
            disabled={loading}
            appearance="primary"
            onClick={() =>
              // dispatch(updateForm({
              //     loading: true, disabled: true
              // }))
              // dispatch(login(userLogin))

              goto()
            }
            className="w-100 btn btn-lg btn-primary text-center"
            type="submit"
          >
            Login
          </Button>
          <p className="mt-5 mb-3 text-muted">&copy; Nossa Casa 2017–2021</p>
        </main>
      </div>
    </div>
  );
}

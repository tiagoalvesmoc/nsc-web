import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthContext } from "../context/auth";

import "../global/styles.css";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import Agendamentos from "../pages/Agendamentos";
import Clientes from "../pages/Clientes";
import LiderCelula from "../pages/LiderCelula";
import Eventos from "../pages/Eventos";
import Live from "../pages/Live";
import YouTubeVideos from "../pages/YouTubeVideos";
import Feeds from "../pages/Feeds";
import SignIn from "./SignIn";

const Routes = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user ? (
        <>
          <Header />
          <div className="container-fluid h-100">
            <div className="row h-100">
              <Router>
                <Sidebar />

                <Switch>
                  <Route path="/" exact component={Agendamentos} />
                  <Route path="/clientes" exact component={Clientes} />
                  <Route path="/" exact component={Agendamentos} />
                  <Route path="/lider-celula" exact component={LiderCelula} />
                  <Route path="/eventos" exact component={Eventos} />
                  <Route path="/lives" exact component={Live} />
                  <Route
                    path="/you-tube-videos-list"
                    exact
                    component={YouTubeVideos}
                  />
                  <Route path="/feeds" exact component={Feeds} />
                </Switch>
              </Router>
            </div>
          </div>
        </>
      ) : (
        <SignIn />
      )}
    </>
  );
};

export default Routes;

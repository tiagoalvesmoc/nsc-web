import { Link, withRouter } from "react-router-dom";
import logo from "../../assets/logo2.png";

const Sidebar = (props) => {
  return (
    <sidebar class="col-2 h-100">
      <img src={logo} className="img-fluid px-3 py-4" />
      <ul>
        <li>
          <Link
            to="/"
            className={props.location.pathname === "/" ? "active" : ""}
          >
            <span className="mdi mdi-calendar-check"></span>
            <text>Agendamentos</text>
          </Link>
        </li>
        <li>
          <Link
            to="/clientes"
            className={props.location.pathname === "/clientes" ? "active" : ""}
          >
            <span className="mdi mdi-account-multiple" active></span>
            <text>Usuarios App</text>
          </Link>
        </li>

        <li>
          <Link
            to="/ "
            className={props.location.pathname === "/clientes" ? "active" : ""}
          >
            <span className="mdi mdi-account-multiple"></span>
            <text>Nossos Membros </text>
          </Link>
        </li>

        <li>
          <Link
            to="/lider-celula"
            className={
              props.location.pathname === "/lider-celula" ? "active" : ""
            }
          >
            <span className="mdi mdi-account-multiple"></span>
            <text>Lider Célula</text>
          </Link>
        </li>

        <li>
          <Link
            to="/eventos"
            className={props.location.pathname === "/eventos" ? "active" : ""}
          >
            <span className="mdi mdi-calendar-check"></span>
            <text>Eventos</text>
          </Link>
        </li>

        <li>
          <Link
            to="/lives"
            className={props.location.pathname === "/lives" ? "active" : ""}
          >
            <span className="mdi mdi-motion-play"></span>
            <text>Lives</text>
          </Link>
        </li>

        <li>
          <Link
            to="/you-tube-videos-list"
            className={
              props.location.pathname === "/you-tube-videos-list"
                ? "active"
                : ""
            }
          >
            <span className="mdi mdi-youtube"></span>
            <text>YouTube Videos</text>
          </Link>
        </li>
        <li>
          <Link
            to="/feeds"
            className={props.location.pathname === "/feeds" ? "active" : ""}
          >
            <span className="mdi mdi-coffee"></span>
            <text>Feeds</text>
          </Link>
        </li>
      </ul>
    </sidebar>
  );
};

export default withRouter(Sidebar);

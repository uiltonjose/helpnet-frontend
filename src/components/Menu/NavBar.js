import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { showModalLogout } from "./LogoutModal";
import { firebaseApp } from "./../../firebase";
import logo from "../../imgs/logo-default.png";
import "../../styles/components/topbar.scss";
import $ from "jquery";

const styles = {
  logo: {
    height: "100px",
    width: "100px",
    marginLeft: "16px"
  }
};
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      providerLogin: ""
    };
  }

  componentDidMount() {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        localStorage.setItem("isLogged", true);
        this.setState({ isLogged: true });
      } else {
        localStorage.setItem("isLogged", false);
        this.setState({ isLogged: false });
      }
    });

    const savedUserInfo = localStorage.getItem("userInfo");
    const providerLogin = JSON.parse(savedUserInfo).login;
    this.setState({ providerLogin });
  }

  render() {
    return (
      <div>
        {this.state.isLogged && (
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary topbar">
            <img src={logo} alt="Help Net" style={styles.logo} />

            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={"/home"}>
                    Home <span className="sr-only">(current)</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/sendNotification"}>
                    Enviar Notificação
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/listNotification"}>
                    Listar Notificação
                  </Link>
                </li>
                {
                  <li className="nav-item">
                    <Link className="nav-link" to={"/myData"} id="as">
                      Meus Dados
                    </Link>
                  </li>
                }
              </ul>
              <div id="logout-group">
                <p id="providerLogin">{this.state.providerLogin}</p>
                <button
                  id="logout-btn"
                  className="btn btn-outline-light my-2 my-sm-0"
                  onClick={() => showModalLogout(this.props.history)}
                >
                  Sair
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    );
  }
}

export default withRouter(NavBar);

$(document).ready(function() {
  $(document).on("click", ".nav-item a", function(e) {
    $(this)
      .parent()
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
});

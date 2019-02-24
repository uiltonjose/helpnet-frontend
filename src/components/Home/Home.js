import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { firebaseApp } from "../../firebase";

class Home extends Component {
  componentWillMount() {
    const savedUserInfo = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(savedUserInfo);

    if (!userInfo || userInfo === undefined || !(userInfo.status === "Ativo")) {
      firebaseApp
        .auth()
        .signOut()
        .then(() => {
          localStorage.clear();
          this.props.history.push("/");
        });
    }
  }

  render() {
    return (
      <div>
        <div className="text-center">
          <h5 className="title">Bem vindo ao Help Net!</h5>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);

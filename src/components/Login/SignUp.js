import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./login.css";
import { firebaseApp } from "../../firebase";
import { get, post, put } from "../../util/RequestUtil";
import Api from "../../util/Endpoints";
import { showMessageOK } from "../../util/AlertDialogUtil";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      pendingRegister: false,
      confirmationCode: ""
    };
  }

  signUpHandler = () => {
    this.setState({ errorMessage: "" });

    let { email, password } = this.state;
    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(encodeURI(email), encodeURI(password))
      .then(() => {
        const user = {};
        user.login = this.state.email;
        post(Api.addUser, user, resp => {
          const result = JSON.parse(resp);
          if (result.code === 200) {
            this.setState({ userId: result.userId });
            this.setState({ pendingRegister: true });
            this.loadProviders();
          } else {
            showMessageOK(
              "",
              "Falha no cadastro do usuário. Por favor, tente novamente.",
              () => {
                // for now, just ignore it.
              }
            );
          }
        });
      })
      .catch(e => {
        let message;
        const errorCode = e.code;
        const code = errorCode && errorCode.split("/")[1];
        switch (code) {
          case "email-already-in-use":
            message =
              "Desculpe, este email já existe em nosso sistema. Por favor, use um email diferente.";
            break;
          case "invalid-email":
            message = "Email inválido.";
            break;
          case "weak-password":
            message = "A senha tem de ser no mínimo 6 caracteres.";
            break;
          default:
            message = "Falha no cadastro. Tente novamente";
            break;
        }
        this.setState({ errorMessage: message });
      });
  };

  loadProviders = () => {
    get(Api.listProviders, resp => {
      const providers = JSON.parse(resp);
      const providerContent = document.getElementById("providerContent");

      //Create and append select list
      const selectList = document.createElement("select");
      selectList.style["width"] = "100%";
      selectList.style["height"] = "30px";
      selectList.id = "mySelect";
      providerContent.appendChild(selectList);

      //Create and append the options
      for (let i = 0; i < providers.length; i++) {
        const option = document.createElement("option");
        option.value = providers[i].ID;
        option.text = providers[i].NOME;
        selectList.appendChild(option);
      }
    });
  };

  handlerChooseProviderAndContinue = () => {
    const mySelect = document.getElementById("mySelect");
    const selectedProvider = mySelect.options[mySelect.selectedIndex].value;

    const userParams = {};
    userParams.userId = this.state.userId.toString();
    userParams.confirmationCode = this.state.confirmationCode;
    userParams.provedorId = selectedProvider;

    put(Api.updateUser, userParams, resp => {
      const result = JSON.parse(resp);
      if (result.code === 200) {
        this.getUserInfo();
      } else {
        this.setState({ errorMessage: result.message });
      }
    });
  };

  getUserInfo = () => {
    const getUserInfoAPI =
      Api.getUserInfo + encodeURIComponent(this.state.email);
    get(getUserInfoAPI, resp => {
      const result = JSON.parse(resp);
      if (result.code === 200 || result.code === 304) {
        showMessageOK("", "Bem vindo ao HelpNet CMS!", () => {
          const userInfoData = result.userInfo;
          localStorage.setItem("isLogged", true);
          localStorage.setItem("userInfo", JSON.stringify(userInfoData));
          this.props.history.push("/home");
        });
      } else {
        // This error occur in our side, or CMS problem or webservice.
        showMessageOK(
          "",
          "Falha no login. Por favor, tente novamente ou se o erro persistir, contactar o HelpNet suporte.",
          () => {
            // for now, just ignore it.
          }
        );
      }
    });
  };

  render() {
    return (
      <div className="card card-container">
        <img
          id="profile-img"
          className="profile-img-card"
          alt="Logo"
          src={require("./images/logo-default.png")}
        />
        <p id="dummySpace" className="profile-name-card" />

        {!this.state.pendingRegister && (
          <div>
            <div id="form-signin" className="form-signin">
              <input
                type="email"
                id="inputEmail"
                className="form-control"
                placeholder="Endereço de email"
                required
                onChange={event => this.setState({ email: event.target.value })}
              />
              <input
                type="password"
                id="inputPassword"
                className="form-control"
                placeholder="Senha (no mínimo 6 caracteres)"
                required
                onChange={event =>
                  this.setState({ password: event.target.value })
                }
              />
              <button
                className="btn btn-lg btn-primary btn-block btn-signin"
                type="button"
                onClick={() => this.signUpHandler()}
              >
                Cadastrar
              </button>
            </div>
            <div>
              Já possui cadastro?
              <span style={{ marginLeft: "6px" }}>
                <Link className="general-link" to={"/signin"}>
                  Faça seu login
                </Link>
              </span>
            </div>
          </div>
        )}

        {this.state.pendingRegister && (
          <div>
            <p style={{ textAlign: "start" }} className="profile-name-card">
              Escolha o provedor:
            </p>
            <div style={{ marginTop: "5px" }} id="providerContent" />
            <input
              type="text"
              id="inputCodeConfirmation"
              style={{ marginTop: "10px" }}
              className="form-control"
              placeholder="Insira o código de confirmação"
              required
              onChange={event =>
                this.setState({ confirmationCode: event.target.value })
              }
            />
            <button
              style={{ marginTop: "10px" }}
              className="btn btn-lg btn-primary btn-block btn-signin"
              type="button"
              onClick={() => this.handlerChooseProviderAndContinue()}
            >
              Continuar
            </button>
          </div>
        )}

        {this.state.errorMessage && (
          <div style={{ marginTop: "10px" }} className="alert alert-danger">
            <strong>Oops!</strong> {this.state.errorMessage}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(SignUp);
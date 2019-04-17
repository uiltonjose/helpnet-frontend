import React, { Component } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import { Button, TextField, Link, Typography } from "@material-ui/core";

import "../../styles/components/login.scss";
import { firebaseApp } from "../../firebase";
import { get, put } from "../../util/RequestUtil";
import Api from "../../util/Endpoints";
import { showMessageOK } from "../../util/AlertDialogUtil";
import { confirmAlert } from "react-confirm-alert";
import Spinner from "../ui/Spinner";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      pendingRegister: false,
      confirmationCode: "",
      isLoading: false
    };
  }

  signInHandler = () => {
    this.setState({ errorMessage: "", isLoading: true });
    let { email, password } = this.state;

    firebaseApp
      .auth()
      .signInWithEmailAndPassword(encodeURI(email), encodeURI(password))
      .then(() => {
        this.getUserInfo();
      })
      .catch(e => {
        console.log("deu erro no catch", e);
        let message;
        const errorCode = e.code;
        const code = errorCode && errorCode.split("/")[1];
        switch (code) {
          case "wrong-password":
          case "invalid-email":
            message = "Email ou senha inválidos.";
            break;
          case "user-not-found":
            message = "Usuário não cadastrado no sistema.";
            break;
          default:
            message = "Falha no Login. Por favor, tente mais tarde.";
            break;
        }
        this.setState({ errorMessage: message, isLoading: false });
      });
  };

  getUserInfo = () => {
    const getUserInfoAPI = `${Api.getUserInfo}${encodeURIComponent(
      this.state.email
    )}`;

    get(getUserInfoAPI, resp => {
      if (resp) {
        const result = JSON.parse(resp);
        if (result.code === 200 || result.code === 304) {
          const userInfoData = result.userInfo;
          if (userInfoData.status === "Ativo") {
            localStorage.setItem("isLogged", true);
            localStorage.setItem("userInfo", JSON.stringify(userInfoData));
            this.props.history.push("/home");
          } else {
            this.setState({ pendingRegister: true, userInfo: userInfoData });
            this.loadProviders();
          }
        } else {
          this.handleGenericError();
        }
      } else {
        this.handleGenericError();
      }
    });
  };

  handleGenericError = () => {
    // This error occur in our side, or CMS problem or webservice.
    this.setState({ isLoading: false });
    showMessageOK(
      "",
      "Falha no login. Por favor, tente novamente ou se o erro persistir, contactar o HelpNet suporte.",
      () => {
        // for now, just ignore it.
      }
    );
  };

  loadProviders = () => {
    get(Api.listProviders, resp => {
      const jsonResponse = JSON.parse(resp);
      if (jsonResponse) {
        const providers = jsonResponse.message;
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
      } else {
        confirmAlert({
          title: "",
          message:
            "Falha ao tentar carregar a lista dos Provedores. Por favor tente novamente. Caso o problema volte ocorrer, entre em contato com o suporte.",
          buttons: [
            {
              label: "OK",
              onClick: () => console.log("Connection refusied")
            }
          ]
        });
      }
    });
  };

  handlerChooseProviderAndContinue = () => {
    const mySelect = document.getElementById("mySelect");
    const selectedProvider = mySelect.options[mySelect.selectedIndex].value;

    const userParams = {};
    userParams.userId = this.state.userInfo.id;
    userParams.confirmationCode = this.state.confirmationCode;
    userParams.providerId = selectedProvider;

    put(Api.updateUser, userParams, resp => {
      const result = JSON.parse(resp);
      if (result.code === 200) {
        this.getUserInfo();
      } else {
        this.setState({ errorMessage: result.message });
      }
    });
  };

  render() {
    return (
      <div className="signin-page">
        <div className="card card-container">
          <img
            id="profile-img"
            className="profile-img-card"
            alt="Logo"
            src={require("./images/logo-default.png")}
          />
          <p id="profile-name" className="profile-name-card" />

          {!this.state.pendingRegister && (
            <div>
              <div id="form-signin" className="form-signin">
                <TextField
                  variant="outlined"
                  type="email"
                  id="inputEmail"
                  className="form-signin-input"
                  label="Endereço de email"
                  required
                  onChange={event =>
                    this.setState({
                      email: event.target.value,
                      errorMessage: undefined
                    })
                  }
                />
                <TextField
                  variant="outlined"
                  type="password"
                  id="inputPassword"
                  className="form-signin-input"
                  label="Senha"
                  required
                  onChange={event =>
                    this.setState({
                      password: event.target.value,
                      errorMessage: undefined
                    })
                  }
                />

                {this.state.isLoading ? (
                  <Spinner />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    className="form-signin-button"
                    onClick={() => this.signInHandler()}
                  >
                    Logar
                  </Button>
                )}
              </div>

              {this.state.errorMessage && (
                <Typography color="secondary" style={{ marginTop: "10px" }}>
                  <strong>Oops!</strong> {this.state.errorMessage}
                </Typography>
              )}

              <Typography style={{ marginTop: "10px" }}>
                <Link component={RouterLink} to={"/forgotpassword"}>
                  Esqueceu a senha?
                </Link>
              </Typography>

              <Typography style={{ marginTop: "10px" }}>
                Não possui cadastro?
                <span style={{ marginLeft: "6px" }}>
                  <Link
                    component={RouterLink}
                    className="general-link"
                    to={"/signup"}
                  >
                    Cadastre-se
                  </Link>
                </span>
              </Typography>
            </div>
          )}

          {this.state.pendingRegister && (
            <div className="form-signin">
              <Typography
                style={{ textAlign: "start" }}
                className="profile-name-card"
              >
                Escolha o provedor:
              </Typography>
              <TextField
                type="text"
                id="inputCodeConfirmation"
                style={{ marginTop: "10px" }}
                className="form-signin-input"
                label="Insira o código de confirmação"
                required
                onChange={event =>
                  this.setState({ confirmationCode: event.target.value })
                }
              />
              <Button
                className="form-signin-button"
                variant="contained"
                color="primary"
                type="button"
                onClick={() => this.handlerChooseProviderAndContinue()}
              >
                Continuar
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(SignIn);

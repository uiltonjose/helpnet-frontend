import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./login.css";
import { firebaseApp } from "../../firebase";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errorMessage: "",
      emailSent: false
    };
  }

  forgotPasswordHandler = () => {
    const emailFilled = this.state.email;
    firebaseApp
      .auth()
      .sendPasswordResetEmail(emailFilled)
      .then(() => {
        // Email sent.
        this.setState({ emailSent: true });
      })
      .catch(e => {
        // An error happened.
        let message;
        const errorCode = e.code;
        const code = errorCode && errorCode.split("/")[1];
        switch (code) {
          case "invalid-email":
            message = "Email inválido.";
            break;
          case "user-not-found":
            message =
              "Não foi possível encontrar uma conta do HelpNet associada a " +
              emailFilled;
            break;
          default:
            message = "Falha na solicitação. Por favor, contactar o suporte.";
            break;
        }
        this.setState({ errorMessage: message });
      });
  };

  goToSignPage = () => {
    this.props.history.push("/signin");
  };

  render() {
    return (
      <div className="card card-container">
        {!this.state.emailSent && (
          <div>
            <h3>Vamos encontrar sua conta</h3>
            <p style={{ marginTop: "16px" }}>Por favor, preencha seu email.</p>

            <div id="form-signin" className="form-signin">
              <input
                type="email"
                id="inputEmail"
                className="form-control"
                placeholder="Endereço de email"
                required
                onChange={event => this.setState({ email: event.target.value })}
              />
              <button
                className="btn btn-lg btn-primary btn-block btn-signin"
                type="button"
                onClick={() => this.forgotPasswordHandler()}
              >
                Procurar
              </button>

              <button
                className="btn btn-lg btn-block btn-signin-cancel"
                type="button"
                onClick={() => this.goToSignPage()}
              >
                Cancelar
              </button>

              {this.state.errorMessage && (
                <div className="alert alert-danger">
                  <strong>Oops!</strong> {this.state.errorMessage}
                </div>
              )}
            </div>
          </div>
        )}
        {this.state.emailSent && (
          <div>
            <h3>Enviamos um link para o seu email!</h3>
            <p style={{ marginTop: "16px", fontSize: "18px" }}>
              Por favor, verifique seu email e siga as instruções.
            </p>

            <button
              className="btn btn-lg btn-primary btn-block btn-signin"
              type="button"
              onClick={() => this.goToSignPage()}
            >
              Finalizar
            </button>

            <p style={{ marginTop: "20px", fontSize: "14px" }}>
              Dica: Se não consegue encontrar o email que enviamos, verifique
              seus spams.
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(ForgotPassword);

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, TextField, Typography } from "@material-ui/core";
import "../../styles/components/login.scss";
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
      <div className="signin-page">
        <div className="card card-container">
          {!this.state.emailSent && (
            <div>
              <Typography>Vamos encontrar sua conta</Typography>
              <Typography style={{ marginTop: "16px" }}>
                Por favor, preencha seu email.
              </Typography>

              <div id="form-signin" className="form-signin">
                <TextField
                  type="email"
                  id="inputEmail"
                  className="form-signin-input"
                  label="Endereço de email"
                  required
                  onChange={event =>
                    this.setState({ email: event.target.value })
                  }
                />
                <Button
                  className="form-signin-button"
                  variant="contained"
                  color="primary"
                  type="button"
                  onClick={() => this.forgotPasswordHandler()}
                >
                  Procurar
                </Button>

                <Button
                  className="form-signin-button"
                  variant="contained"
                  type="button"
                  onClick={() => this.goToSignPage()}
                >
                  Cancelar
                </Button>

                {this.state.errorMessage && (
                  <Typography color="secondary">
                    <strong>Oops!</strong> {this.state.errorMessage}
                  </Typography>
                )}
              </div>
            </div>
          )}
          {this.state.emailSent && (
            <div className="form-signin">
              <Typography>Enviamos um link para o seu email!</Typography>
              <Typography style={{ margin: "16px 0", fontSize: "16px" }}>
                Por favor, verifique seu email e siga as instruções.
              </Typography>

              <Button
                className="form-signin-button"
                variant="contained"
                color="primary"
                type="button"
                onClick={() => this.goToSignPage()}
              >
                Finalizar
              </Button>

              <Typography style={{ marginTop: "20px", fontSize: "14px" }}>
                Dica: Se não consegue encontrar o email que enviamos, verifique
                seus spams.
              </Typography>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(ForgotPassword);

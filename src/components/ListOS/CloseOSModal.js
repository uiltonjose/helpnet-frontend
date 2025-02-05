import React from "react";
import Modal from "react-modal";
import API from "../../util/Endpoints";
import "../../styles/components/modal.scss";
import { post } from "../../util/RequestUtil";
import "react-confirm-alert/src/react-confirm-alert.css";
import Spinner from "../ui/Spinner";
import { showMessageOK } from "../../util/AlertDialogUtil";
import finish from "../../imgs/finished.png";

const changeSituation = API.changeSituation;

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement(document.getElementById("modal"));

class AssociateUserModal extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      problemResolution: "",
      messageToCustomer: "",
      errorMessage: "",
      isLoading: false
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeMessage = this.closeMessage.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.handleChangeMessageToCustomer = this.handleChangeMessageToCustomer.bind(
      this
    );
    this.handleProblemResolution = this.handleProblemResolution.bind(this);
  }

  componentWillMount() {
    const savedUserInfo = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(savedUserInfo);
    this.setState({ userInfo });
    this.setState({ os: this.props.os });
    this.setState({ title: "Deseja realmente finalizar esta OS?" });
  }

  componentDidMount() {
    this.setState({ isLoading: true });
  }

  openModal() {
    this.setState({
      problemResolution: "",
      messageToCustomer: "",
      modalIsOpen: true,
      isLoading: false
    });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  builderEventOs = os => {
    let jsonResult = {};
    jsonResult.osNumber = this.props.os.Número;
    jsonResult.situationId = 3;
    jsonResult.messageToCustomer = this.state.messageToCustomer;
    jsonResult.userId = null;
    jsonResult.event = {};
    jsonResult.event.userId = this.state.userInfo["id"];
    jsonResult.event.eventTypeID = 4;
    jsonResult.event.description = this.state.problemResolution;
    return jsonResult;
  };

  sendForm() {
    this.setState({ errorMessage: "", isLoading: true });
    if (this.state.problemResolution === "") {
      this.setState({
        errorMessage: "* A resolução do problema precisa ser informada",
        isLoading: false
      });
    } else {
      let url = `${changeSituation}`;
      const body = this.builderEventOs(this.state.os);

      post(url, body).then(resp => {
        if (resp && resp.data.code === 200) {
          this.closeModal();
          this.successChangeSituationOS();
          this.setState({ isLoading: false });
        } else {
          this.failUpdateOS();
        }
      });
    }
  }

  closeMessage() {
    this.setState({ errorMessage: "" });
  }

  failUpdateOS = () => {
    showMessageOK(
      "",
      "Falha ao tentar finalizar a Ordem de Serviço. Por favor tente novamente. Caso o problema volte ocorrer, entre em contato com o suporte.",
      () => {
        this.setState({ isLoading: false });
      }
    );
  };

  successChangeSituationOS = () => {
    showMessageOK("", "OS atualizada com sucesso.", () => {
      this.setState({ isLoading: false });
    });
  };

  handleChangeMessageToCustomer(event) {
    this.setState({ messageToCustomer: event.target.value });
  }

  handleProblemResolution(event) {
    this.setState({ problemResolution: event.target.value });
  }

  render() {
    return (
      <div className="inLine">
        <img
          data-
          src={finish}
          alt="Detalhes da OS"
          className="action center"
          onClick={this.openModal}
        />
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          className="content"
          contentLabel="Example Modal"
        >
          {this.state.isLoading ? (
            <div className="spinner-loading-page">
              <Spinner />
            </div>
          ) : (
            <div className="container">
              <div className="text-center">
                <h4 className="title bold">{this.state.title}</h4>
              </div>
              {this.state.errorMessage && (
                <div className="alert alert-danger display-linebreak ">
                  <div className="textMessageError">
                    {this.state.errorMessage}
                  </div>
                  <div align="right" className="topnav search-container">
                    <button
                      onClick={this.closeMessage}
                      type="button"
                      className="btn btn-secondary"
                    >
                      X
                    </button>
                  </div>
                </div>
              )}
              <div className="form-group bold">
                <label>Resolução do Problema</label>
                <textarea
                  value={this.state.problemResolution}
                  onChange={this.handleProblemResolution}
                  rows="3"
                  className="form-control"
                  aria-describedby="conteudoHelp"
                  placeholder="Descreva como o problema foi resolvido"
                  required
                />
                <small id="conteudoHelp" className="form-text text-muted">
                  O preenchimento deste campo é obrigatório, as informações
                  contidas neste campo serão utilizadas para futuras consultas.
                </small>
              </div>
              <div className="form-group bold">
                <label>Mensagem para o cliente</label>
                <textarea
                  value={this.state.messageToCustomer}
                  onChange={this.handleChangeMessageToCustomer}
                  rows="3"
                  className="form-control"
                  aria-describedby="conteudoHelp"
                  placeholder="Adicione informações para o cliente"
                />
                <small id="conteudoHelp" className="form-text text-muted">
                  O preenchimento deste campo é opcional, as informações
                  contidas nesta campo serão enviadas para o cliente.
                </small>
              </div>
              <div align="right" className="topnav search-container">
                <div className="buttons">
                  <button
                    onClick={this.closeModal}
                    type="button"
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
                <div>
                  <button
                    onClick={this.sendForm}
                    type="button"
                    className="btn btn-primary"
                  >
                    Finalizar OS
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default AssociateUserModal;

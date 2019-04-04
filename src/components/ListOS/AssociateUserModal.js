import React from "react";
import Modal from "react-modal";
import API from "../../util/Endpoints";
import "./modal.css";
import { post, get } from "../../util/RequestUtil";
import { unavailableServiceAlert } from "../../util/AlertDialogUtil";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Spinner from "../ui/Spinner";

const changeSituation = API.changeSituation;
const listByProviderId = API.listByProviderId;

//TODO Não consegui resolver isso aqui ainda
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement(document.getElementById("modal"));

class AssociateUserModal extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      listResponsible: [],
      observation: "",
      responsible: "",
      errorMessage: "",
      action: "",
      isLoading: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeMessage = this.closeMessage.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.handleChangeResponsible = this.handleChangeResponsible.bind(this);
    this.handleChangeObservation = this.handleChangeObservation.bind(this);
  }

  componentWillMount() {
    const savedUserInfo = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(savedUserInfo);

    this.setState({
      userInfo,
      os: this.props.os,
      title: "Selecione o Tecnico que ficará responsável por esta OS"
    });

    if (this.props.action === "changeResponsable") {
      this.setState({
        action: "Confirmar o novo responsável",
        actionFromList: "Alterar Responsável"
      });
    } else {
      this.setState({
        action: "Encaminhar OS para atendimento",
        actionFromList: "Definir Responsável"
      });
    }
  }

  componentDidMount() {}

  loadResponsible = () => {
    const providerId = this.state.userInfo["provedor_id"];
    const url = `${listByProviderId}${providerId}`;
    get(url, resp => {
      if (resp !== "") {
        const jsonResp = JSON.parse(resp);
        const listResponsible = jsonResp.message;
        this.setState({ listResponsible });
      } else {
        unavailableServiceAlert(() => {
          this.setState({ isLoading: false });
        });
      }
    });
    this.setState({ isLoading: false });
  };

  openModal() {
    this.setState({ observation: "", responsible: "", modalIsOpen: true });
    this.setState({ isLoading: true });
    this.loadResponsible();
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
    jsonResult.situationId = 2;
    jsonResult.messageToCustomer = null;
    jsonResult.userId = this.state.responsible;
    jsonResult.event = {};
    jsonResult.event.userId = this.state.userInfo["id"];
    jsonResult.event.eventTypeID = 2;
    jsonResult.event.description = this.state.observation;
    return jsonResult;
  };

  sendForm() {
    this.setState({ errorMessage: "", isLoading: true });
    if (this.state.responsible === "") {
      this.setState({
        errorMessage: "* O responsável pela OS precisa ser informado",
        isLoading: false
      });
    } else {
      let url = `${changeSituation}`;
      const body = this.builderEventOs(this.state.os);

      post(url, body, resp => {
        if (resp !== "") {
          const jsonResponse = JSON.parse(resp);
          if (jsonResponse && jsonResponse.code === 200) {
            this.closeModal();
            this.successChangeSituationOS();
            this.setState({ isLoading: false });
          } else {
            this.failUpdateOS();
          }
        } else {
          unavailableServiceAlert(() => {
            this.setState({ isLoading: false });
          });
        }
      });
    }
  }

  closeMessage() {
    this.setState({ errorMessage: "" });
  }

  failUpdateOS = () => {
    confirmAlert({
      title: "",
      message:
        "Falha ao tentar associar um responsável. Por favor tente novamente. Caso o problema volte ocorrer, entre em contato com o suporte.",
      buttons: [
        {
          label: "OK",
          onClick: () => {
            this.setState({ isLoading: false });
          }
        }
      ]
    });
  };

  successChangeSituationOS = () => {
    confirmAlert({
      title: "",
      message: "OS atualizada com sucesso.",
      buttons: [
        {
          label: "OK",
          onClick: () => {
            this.setState({ isLoading: false });
          }
        }
      ]
    });
  };

  handleChangeResponsible(event) {
    this.setState({
      responsible: event.target.value
    });
  }

  handleChangeObservation(event) {
    this.setState({ observation: event.target.value });
  }

  render() {
    return (
      <div>
        <div className="blue">
          <button
            onClick={this.openModal}
            type="button"
            className="btn btn-primary"
          >
            {this.state.actionFromList}
          </button>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
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
                <label>Selecione um responsável</label>
                <select
                  className="form-control"
                  onChange={this.handleChangeResponsible}
                  value={this.responsible}
                  required
                >
                  <option>{"Selecione uma responsável para esta OS"}</option>
                  {this.state.listResponsible.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.login}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group bold">
                <label>Observação</label>
                <textarea
                  value={this.state.observation}
                  onChange={this.handleChangeObservation}
                  rows="3"
                  className="form-control"
                  aria-describedby="conteudoHelp"
                  placeholder="Acrescentes informações para o Técnico"
                />
                <small id="conteudoHelp" className="form-text text-muted">
                  O preenchimento deste campo é opcional, você pode informar
                  mais detalhes sobre o problema ou a resolução do mesmo.
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
                    {this.state.action}
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

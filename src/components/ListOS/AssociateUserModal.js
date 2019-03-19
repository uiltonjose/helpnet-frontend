import React from "react";
import Modal from "react-modal";
import API from "../../util/Endpoints";
import { post } from "../../util/RequestUtil";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { get } from "../../util/RequestUtil";

const changeSituation = API.changeSituation;
const listByProviderId = API.listByProviderId;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement(document.getElementById("modal"));

class AssociateUserModal extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      listResponsible: [],
      observation: "",
      responsible: ""
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.handleChangeResponsible = this.handleChangeResponsible.bind(this);
    this.handleChangeObservation = this.handleChangeObservation.bind(this);
  }

  componentWillMount() {
    const savedUserInfo = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(savedUserInfo);
    this.setState({ userInfo });
    this.setState({ os: this.props.os });
    this.setState({
      title: "Selecione o Tecnico que ficará responsável por esta OS"
    });
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.loadResponsible();
  }

  loadResponsible = () => {
    const providerId = this.state.userInfo["provedor_id"];
    const url = `${listByProviderId}${providerId}`;
    get(url, resp => {
      if (resp !== "") {
        const jsonResp = JSON.parse(resp);
        const listResponsible = jsonResp.message;
        this.setState({ listResponsible });
      } else {
        this.unavailableServiceAlert();
      }
    });
    this.setState({ isLoading: false });
  };

  openModal() {
    this.setState({ modalIsOpen: true });
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
    jsonResult.userId = this.state.responsible;
    jsonResult.event = {};
    jsonResult.event.userId = this.state.userInfo["id"];
    jsonResult.event.eventTypeID = 2;
    jsonResult.event.description = this.state.observation;
    return jsonResult;
  };

  sendForm() {
    let url = `${changeSituation}`;
    const body = this.builderEventOs(this.state.os);

    post(url, body, resp => {
      if (resp !== "") {
        const jsonResponse = JSON.parse(resp);
        if (jsonResponse) {
          const resultCode = jsonResponse.code;
          if (resultCode === 200) {
            this.closeModal();
            this.successChangeSituationOS();
          }
        } else {
          this.failUpdateOS();
        }
      } else {
        this.unavailableServiceAlert();
      }
    });
  }
  unavailableServiceAlert = () => {
    confirmAlert({
      title: "",
      message:
        "O serviço está indisponível, por favor tente novamente. Caso o problema volte ocorrer, entre em contato com o suporte.",
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

  failUpdateOS = () => {
    confirmAlert({
      title: "",
      message:
        "Falha ao tentar carregar a lista das Ordem de Serviços. Por favor tente novamente. Caso o problema volte ocorrer, entre em contato com o suporte.",
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
            Definir Responsável
          </button>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="container">
            <div align="right" className="topnav search-container">
              <button
                onClick={this.closeModal}
                type="button"
                className="btn btn-primary"
              >
                X
              </button>
            </div>
            <div className="text-center">
              <h4 className="title bold">{this.state.title}</h4>
            </div>
            <div className="form-group bold">
              <label>Selecione um responsável</label>
              <select
                className="form-control"
                onChange={this.handleChangeResponsible}
                value={this.responsible}
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
              <label>Observacao</label>
              <textarea
                value={this.state.observation}
                onChange={this.handleChangeObservation}
                rows="3"
                className="form-control"
                aria-describedby="conteudoHelp"
                placeholder="Acrescentes informações para o Técnico"
              />
              <small id="conteudoHelp" className="form-text text-muted">
                O preenchimento deste campo é opcional, você pode informar mais
                detalhes sobre o problema ou a resolução do mesmo.
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
                  Encaminhar OS para atendimento
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AssociateUserModal;

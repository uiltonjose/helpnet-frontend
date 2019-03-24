import React from "react";
import Modal from "react-modal";
import API from "../../util/Endpoints";
import { post } from "../../util/RequestUtil";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Spinner from "../ui/Spinner";

const changeSituation = API.changeSituation;

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

class OsDetailsModal extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      problemResolution: "",
      msgToCustomer: "",
      errorMessage: "",
      isLoading: false
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeMessage = this.closeMessage.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.handleChangeMsgToCustomer = this.handleChangeMsgToCustomer.bind(this);
    this.handleProblemResolution = this.handleProblemResolution.bind(this);
  }

  componentWillMount() {
    const savedUserInfo = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(savedUserInfo);
    this.setState({ userInfo });
    this.setState({ os: this.props.os });
    this.setState({ title: "Detalhes da OS" });
  }

  componentDidMount() {
    this.setState({ isLoading: true });
  }

  openModal() {
    this.setState({ problemResolution: "" });
    this.setState({ msgToCustomer: "" });
    this.setState({ modalIsOpen: true });
    this.setState({ isLoading: false });
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
    jsonResult.event = {};
    jsonResult.event.userId = this.state.userInfo["id"];
    jsonResult.event.eventTypeID = 4;
    jsonResult.event.description = this.state.observation;
    return jsonResult;
  };

  sendForm() {
    this.setState({ errorMessage: "", isLoading: true });
    if (this.state.problemResolution === "") {
      this.setState({
        errorMessage: "* A resolução do problema precisa ser informada"
      });
      this.setState({ isLoading: false });
    } else {
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
              this.setState({ isLoading: false });
            }
          } else {
            this.failUpdateOS();
          }
        } else {
          this.unavailableServiceAlert();
        }
      });
    }
  }

  closeMessage() {
    this.setState({ errorMessage: "" });
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

  handleChangeMsgToCustomer(event) {
    this.setState({ msgToCustomer: event.target.value });
  }

  handleProblemResolution(event) {
    this.setState({ problemResolution: event.target.value });
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
            Detalhes da OS
          </button>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          {this.state.isLoading ? (
            <div className="spinner-loading-page">
              <Spinner />
            </div>
          ) : (
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
              <label>
                <h5> -- AQUI FICA OS DETALHES DA OS -- </h5>
              </label>
              <div align="right" className="topnav search-container">
                <div>
                  <button
                    onClick={this.closeModal}
                    type="button"
                    className="btn btn-primary"
                  >
                    Fechar
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

export default OsDetailsModal;

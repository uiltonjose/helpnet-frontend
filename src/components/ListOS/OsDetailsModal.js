import React from "react";
import Modal from "react-modal";
import API from "../../util/Endpoints";
import "./modal.css";
import { get } from "../../util/RequestUtil";
import { confirmAlert } from "react-confirm-alert";
import { unavailableServiceAlert } from "../../util/AlertDialogUtil";
import "react-confirm-alert/src/react-confirm-alert.css";
import Spinner from "../ui/Spinner";

const getOsByNumber = API.getOsByNumber;

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
      osSelected: {},
      isLoading: false
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeMessage = this.closeMessage.bind(this);
    this.getOsByNumber = this.getOsByNumber.bind(this);
  }

  componentWillMount() {
    const savedUserInfo = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(savedUserInfo);
    this.setState({ userInfo, os: this.props.os, title: "Detalhes da OS" });
  }

  componentDidMount() {
    this.setState({ isLoading: true });
  }

  openModal() {
    this.setState({
      problemResolution: "",
      msgToCustomer: "",
      modalIsOpen: true,
      isLoading: false
    });
    this.getOsByNumber();
  }

  getOsByNumber() {
    const os = this.props.os;
    const url = `${getOsByNumber}${os.Número}`;
    get(url, resp => {
      if (resp !== "") {
        const jsonResp = JSON.parse(resp);
        const osSelected = jsonResp.data;
        this.setState({ osSelected });
      } else {
        unavailableServiceAlert(() => {
          this.setState({ isLoading: false });
        });
      }
    });
    this.setState({ isLoading: false });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  closeMessage() {
    this.setState({ errorMessage: "" });
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
              <div className="container">
                <div className="form-group bold left">
                  <label htmlFor="title">Número OS</label>
                  <input
                    value={this.state.osSelected.numeroOS}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold right">
                  <label htmlFor="title">CPF do cliente</label>
                  <input
                    value={this.state.osSelected.cpf_cnpj}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold">
                  <label htmlFor="title">Nome do cliente</label>
                  <input
                    value={this.state.osSelected.nomeCliente}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>

                <div className="form-group bold">
                  <label htmlFor="title">Referência</label>
                  <input
                    value={this.state.osSelected.nome_res}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold">
                  <label htmlFor="title">Data do Cadastro</label>
                  <input
                    value={this.state.osSelected.dataCadastroProvedor}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold left">
                  <label htmlFor="title">Login</label>
                  <input
                    value={this.state.osSelected.login}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold right">
                  <label htmlFor="title">Plano</label>
                  <input
                    value={this.state.osSelected.plabo}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold left">
                  <label htmlFor="title">Telefone</label>
                  <input
                    value={this.state.osSelected.fone}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold right">
                  <label htmlFor="title">Celular</label>
                  <input
                    value={this.state.osSelected.celular}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold left">
                  <label htmlFor="title">Endereço</label>
                  <input
                    value={this.state.osSelected.endereco}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold right">
                  <label htmlFor="title">Número</label>
                  <input
                    value={this.state.osSelected.numero}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold left">
                  <label htmlFor="title">Bairro</label>
                  <input
                    value={this.state.osSelected.bairro}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold right">
                  <label htmlFor="title">Cidade</label>
                  <input
                    value={this.state.osSelected.cidade}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold">
                  <label htmlFor="title">Problema</label>
                  <input
                    value={this.state.osSelected.problema}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group bold">
                  <label htmlFor="title">Detalhe da OS</label>
                  <input
                    value={this.state.osSelected.detalhesOS}
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
              </div>
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

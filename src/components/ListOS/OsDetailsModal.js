import React from "react";
import ReactTable from "react-table";
import Modal from "react-modal";
import API from "../../util/Endpoints";
import "./modal.css";
import { get } from "../../util/RequestUtil";
import { unavailableServiceAlert } from "../../util/AlertDialogUtil";
import "react-confirm-alert/src/react-confirm-alert.css";
import Spinner from "../ui/Spinner";
import Chance from "chance";
import details from "../../imgs/details.png";
import AssociateUserModal from "./AssociateUserModal";
import CloseOSModal from "./CloseOSModal";
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

  getColumnsOS = ossParam => {
    const columns = [];
    if (Object.keys(ossParam).length > 0) {
      Object.keys(ossParam[0]).forEach(key => {
        if (key !== "_id") {
          columns.push({
            accessor: key,
            Header: key
          });
        }
      });
    }
    return columns;
  };

  getDataOS = ossParam => {
    const data = ossParam.map(item => {
      const _id = new Chance().guid();
      return {
        _id,
        ...item
      };
    });
    return data;
  };

  getOsByNumber() {
    const os = this.props.os;
    const url = `${getOsByNumber}${os.Número}`;
    get(url, resp => {
      if (resp !== "") {
        const jsonResp = JSON.parse(resp);
        const osSelected = jsonResp.data;
        const columns = this.getColumnsOS(osSelected.event);
        const events = this.getDataOS(osSelected.event);
        this.setState({
          osSelected,
          events,
          columns,
          isLoading: false
        });
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
    let { columns } = this.state;
    if (typeof columns === "undefined") {
      columns = [];
    }
    return (
      <div className="inLine">
        <img
          src={details}
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
            <div className="container scrollable">
              <div className="text-center">
                <h4 className="title bold">{this.state.title}</h4>
              </div>
              <div className="container">
                <div className="left">
                  <label className="bold">Número OS:&nbsp;</label>
                  <label>{this.state.osSelected.numeroOS}</label>
                </div>
                <div className="right">
                  <label className="bold">CPF do cliente:&nbsp; </label>
                  <label>{this.state.osSelected.cpf_cnpj}</label>
                </div>
                <div>
                  <label className="bold">Nome do cliente:&nbsp;</label>
                  <label>{this.state.osSelected.nomeCliente}</label>
                </div>
                <div>
                  <label className="bold">Referência:&nbsp;</label>
                  <label>{this.state.osSelected.nome_res}</label>
                </div>
                <div>
                  <label className="bold">Data do Cadastro:&nbsp;</label>
                  <label>{this.state.osSelected.dataCadastroProvedor}</label>
                </div>
                <div className="left">
                  <label className="bold">Login:&nbsp;</label>
                  <label>{this.state.osSelected.login}</label>
                </div>
                <div className="left">
                  <label className="bold">Plano:&nbsp;</label>
                  <label>{this.state.osSelected.plano}</label>
                </div>
                <div className="left">
                  <label className="bold">Telefone:&nbsp;</label>
                  <label>{this.state.osSelected.fone}</label>
                </div>
                <div className="left">
                  <label className="bold">Celular:&nbsp;</label>
                  <label>{this.state.osSelected.celular}</label>
                </div>
                <div className="left">
                  <label className="bold">Endereço:&nbsp;</label>
                  <label>{this.state.osSelected.endereco}</label>
                </div>
                <div className="left">
                  <label className="bold">Número:&nbsp;</label>
                  <label>{this.state.osSelected.numero}</label>
                </div>
                <div className="left">
                  <label className="bold">Bairro:&nbsp;</label>
                  <label>{this.state.osSelected.bairro}</label>
                </div>
                <div className="left">
                  <label className="bold">Cidade:&nbsp;</label>
                  <label>{this.state.osSelected.cidade}</label>
                </div>
                <div>
                  <label className="bold">Problema:&nbsp;</label>
                  <label>{this.state.osSelected.problema}</label>
                </div>
                <div>
                  <label className="bold">Detalhe da OS:&nbsp;</label>
                  <label>{this.state.osSelected.detalhesOS}</label>
                </div>
              </div>
              <div className="center">
                {this.props.situation !== "closed" ? (
                  <div className="inLine">
                    <AssociateUserModal os={this.props.os} />
                  </div>
                ) : (
                  <div />
                )}
                {this.props.situation === "inProgress" ? (
                  <div className="inLine">
                    <CloseOSModal os={this.props.os} />
                  </div>
                ) : (
                  <div />
                )}
              </div>
              <div className="container">
                <div className="text-center">
                  <h4 className="title bold">Eventos da OS</h4>
                </div>
                <div className="form-group bold">
                  <ReactTable
                    minRows={0}
                    data={this.state.events}
                    columns={columns}
                    loadingText={"Carregando..."}
                    noDataText={"Lista vazia."}
                    showPagination={false}
                  />
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
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default OsDetailsModal;

import React, { Component } from "react";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import "react-table/react-table.css";
import "rc-checkbox/assets/index.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import Spinner from "../ui/Spinner";
import Chance from "chance";
import { formatToTimeZone } from "date-fns-timezone";
import { get } from "../../util/RequestUtil";
import Api from "../../util/Endpoints";
import CloseOSModal from "./CloseOSModal";
import AssociateUserModal from "./AssociateUserModal";

const listOsByProviderIdAndInProgress = Api.listOsByProviderIdAndInProgress;

class ListOSInProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      errorMessage: "",
      providerId: "",
      isLoading: false
    };
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

  failLoadOsList = () => {
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

  componentWillMount() {
    const savedUserInfo = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(savedUserInfo);
    this.setState({ userInfo });
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.loadOSs();
  }

  loadOSs = () => {
    const providerId = this.state.userInfo["provedor_id"];
    this.setState({ providerId });
    const url = `${listOsByProviderIdAndInProgress}${providerId}`;
    get(url, resp => {
      if (resp !== "") {
        const jsonResponse = JSON.parse(resp);
        if (jsonResponse) {
          const listOS = jsonResponse.message;
          const columns = this.getColumnsOS(listOS);
          const ossFiltered = this.getDataOS(listOS);
          this.setState({
            ossFiltered,
            columns,
            isLoading: false
          });
        } else {
          this.failLoadOsList();
        }
      } else {
        this.unavailableServiceAlert();
      }
    });
  };

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
      columns.push({
        id: "action",
        accessor: row => (
          <div>
            <CloseOSModal os={row} />
            <AssociateUserModal action="changeResponsable" os={row} />
          </div>
        ),
        Header: "Ação"
      });
    }
    return columns;
  };

  closedOS = () => {};

  getDataOS = ossParam => {
    const data = ossParam.map(item => {
      const _id = new Chance().guid();
      const date = new Date(item.Data_Abertura);
      const formatTemplate = "DD-MM-YYYY HH:mm";
      const timeZone = { timeZone: "America/Recife" }; //TODO: The Improvement is to get timezone from the Server.

      item.Data_Abertura = formatToTimeZone(date, formatTemplate, timeZone);

      return {
        _id,
        ...item
      };
    });
    return data;
  };

  render() {
    let { columns } = this.state;
    if (typeof columns === "undefined") {
      columns = [];
    }

    return (
      <div id="listOSInProgress">
        {this.state.errorMessage && (
          <div className="alert alert-danger display-linebreak">
            {this.state.errorMessage}
          </div>
        )}
        {this.state.isLoading ? (
          <div className="spinner-loading-page">
            <Spinner />
          </div>
        ) : (
          <div className="container">
            <div id="modal" />
            <ReactTable
              ref={r => (this.checkboxTable = r)}
              filterable={true}
              defaultFilterMethod={this.defaultFilter}
              minRows={0}
              data={this.state.ossFiltered}
              columns={columns}
              previousText={"Anterior"}
              nextText={"Próximo"}
              defaultPageSize={10}
              loadingText={"Carregando..."}
              noDataText={"Lista vazia."}
              pageText={"Página"}
              ofText={"de"}
              rowsText={"linhas"}
            />
          </div>
        )}
      </div>
    );
  }
}

export default ListOSInProgress;

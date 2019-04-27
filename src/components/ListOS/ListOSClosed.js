﻿import React, { Component } from "react";
import ReactTable from "react-table";
import {
  unavailableServiceAlert,
  failLoadOsList
} from "../../util/AlertDialogUtil";
import "react-table/react-table.css";
import "rc-checkbox/assets/index.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import Spinner from "../ui/Spinner";
import Chance from "chance";
import { formatToTimeZone } from "date-fns-timezone";
import { get } from "../../util/RequestUtil";
import Api from "../../util/Endpoints";
import OsDetailsModal from "./OsDetailsModal";

const listOsByProviderIdAndSituationClosed =
  Api.listOsByProviderIdAndSituationClosed;

class ListOSClosed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      errorMessage: "",
      providerId: "",
      isLoading: false
    };
  }

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
    const url = `${listOsByProviderIdAndSituationClosed}${providerId}`;
    get(url).then(resp => {
      if (resp) {
        const jsonResponse = resp.data;
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
          failLoadOsList(() => {
            this.setState({ isLoading: false });
          });
        }
      } else {
        unavailableServiceAlert(() => {
          this.setState({ isLoading: false });
        });
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
          <div className="center">
            <OsDetailsModal os={row} situation="closed" />
          </div>
        ),
        Header: "Ação"
      });
    }
    return columns;
  };

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
      <form id="formQuestion" onSubmit={this.handleSubmit}>
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
      </form>
    );
  }
}

export default ListOSClosed;

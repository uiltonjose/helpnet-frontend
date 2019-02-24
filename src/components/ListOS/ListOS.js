﻿import React, { Component } from "react";
import ReactTable from "react-table";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import Chance from "chance";
import { confirmAlert } from "react-confirm-alert";
import "react-table/react-table.css";
import "rc-checkbox/assets/index.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import { formatToTimeZone } from "date-fns-timezone";

import { get } from "../../util/RequestUtil";
import Api from "../../util/Endpoints";

const listOSsByProviderId = Api.listOSsByProviderId;
const CheckboxTable = checkboxHOC(ReactTable);

class ListOSs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      selection: [],
      selectAll: false,
      activeOSsChecked: "S",
      defaulterOSsChecked: "S",
      errorMessage: "",
      providerId: ""
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
          onClick: () => console.log("Connection refusied")
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
    this.loadOSs();
  }

  loadOSs = () => {
    const providerId = this.state.userInfo["provedor_id"];
    this.setState({ providerId });
    const url = listOSsByProviderId + providerId;
    get(url, resp => {
      if (resp !== "") {
        const ossAll = JSON.parse(resp);
        const columns = this.getColumnsOSs(ossAll);
        const ossFiltered = this.getDataOSs(ossAll);
        this.setState({
          ossFiltered,
          columns
        });
      } else {
        this.unavailableServiceAlert();
      }
    });
  };

  getColumnsOSs = ossParam => {
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

  getDataOSs = ossParam => {
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

  defaultFilter = (filter, row, column) => {
    const id = filter.pivotId || filter.id;
    return row[id] !== undefined
      ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
      : true;
  };

  toggleSelection = (key, shift, row) => {
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
  };

  toggleAll = () => {
    const selectAll = this.state.selectAll ? false : true;
    const selection = [];
    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach(item => {
        selection.push(item._original._id);
      });
    }
    this.setState({ selectAll, selection });
  };
  isSelected = key => {
    return this.state.selection.includes(key);
  };
  render() {
    const { toggleSelection, toggleAll, isSelected } = this;
    let { columns, selectAll } = this.state;
    if (typeof columns === "undefined") {
      columns = [];
    }
    const checkboxProps = {
      selectAll,
      isSelected,
      toggleSelection,
      toggleAll,
      selectType: "checkbox"
    };

    return (
      <form id="formQuestion" onSubmit={this.handleSubmit}>
        {this.state.errorMessage && (
          <div className="alert alert-danger display-linebreak">
            {this.state.errorMessage}
          </div>
        )}
        <div className="container">
          <div className="text-center">
            <h4 className="title bold">Ordens de Serviço Registradas</h4>
          </div>
          <CheckboxTable
            ref={r => (this.checkboxTable = r)}
            filterable={true}
            defaultFilterMethod={this.defaultFilter}
            minRows={0}
            data={this.state.ossFiltered}
            columns={columns}
            {...checkboxProps}
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
      </form>
    );
  }
}

export default ListOSs;
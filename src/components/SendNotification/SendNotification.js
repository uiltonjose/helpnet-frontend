import React, { Component } from "react";
import ReactTable from "react-table";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import Chance from "chance";
import { confirmAlert } from "react-confirm-alert";
import { unavailableServiceAlert } from "../../util/AlertDialogUtil";
import "../../styles/components/sendNotification.scss";
import "react-table/react-table.css";
import "rc-checkbox/assets/index.css";
import "react-confirm-alert/src/react-confirm-alert.css";

import { get, post } from "../../util/RequestUtil";
import Api from "../../util/Endpoints";
import { getElementById } from "../../util/Util";

import { showMessageOK } from "../../util/AlertDialogUtil";
import Spinner from "../ui/Spinner";

const listCustomersByProviderIdAPI = Api.listCustomerByProviderId;
const listDefaultMessageForNotificationAPI =
  Api.listDefaultMessageForNotification;
const sendNotificationAPI = Api.sendNotification;
const CheckboxTable = checkboxHOC(ReactTable);

class SendNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      message: "",
      selection: [],
      selectAll: false,
      activeCustomersChecked: "S",
      defaulterCustomersChecked: "S",
      errorMessage: "",
      providerId: "",
      userId: "",
      blockOpenNewOS: false,
      defaultMessageSelected: "",
      listDefaultMessages: [],
      isLoading: false
    };

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.handleChangeDefaultMessage = this.handleChangeDefaultMessage.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleBlockOpenOS = this.handleBlockOpenOS.bind(this);
  }

  failLoadCustomersAlert = () => {
    confirmAlert({
      title: "",
      message:
        "Falha ao tentar carregar a lista dos clientes. Por favor tente novamente. Caso o problema volte ocorrer, entre em contato com o suporte.",
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
    this.loadCustomers();
    this.loadDefaultMessages();
  }

  loadDefaultMessages = () => {
    const url = listDefaultMessageForNotificationAPI;
    get(url, resp => {
      if (resp !== "") {
        const jsonResp = JSON.parse(resp);
        const listDefaultMessages = jsonResp.data;
        this.setState({ listDefaultMessages });
      } else {
        unavailableServiceAlert(() => {
          this.setState({ isLoading: false });
        });
      }
    });
  };

  loadCustomers = () => {
    const providerId = this.state.userInfo["provedor_id"];
    const userId = this.state.userInfo["id"];

    this.setState({ providerId, userId });
    const url = `${listCustomersByProviderIdAPI}${providerId}`;

    get(url, resp => {
      if (resp !== "") {
        const jsonResp = JSON.parse(resp);
        if (jsonResp) {
          const listCustomer = jsonResp.message;
          const columns = this.getColumnsCustomers(listCustomer);
          const customersFiltered = this.getDataCustomers(listCustomer);
          this.setState({
            customersFiltered,
            columns,
            isLoading: false
          });
        } else {
          this.failLoadCustomersAlert();
        }
      } else {
        unavailableServiceAlert(() => {
          this.setState({ isLoading: false });
        });
      }
    });
  };

  builderPushNotification = () => {
    let notification = {};
    const {
      userId,
      title,
      message,
      blockOpenNewOS,
      selection,
      customersFiltered
    } = this.state;

    notification.userId = userId;
    notification.title = title;
    notification.message = message;
    notification.blockOpenNewOS = blockOpenNewOS;
    let customersSelected = selection;
    let listCutomersId = [];

    customersSelected.forEach(_id => {
      listCutomersId.push(findArrayElementBy_id(customersFiltered, _id));
    });

    function findArrayElementBy_id(array, _id) {
      return array.find(element => {
        return element._id === _id;
      });
    }

    let tags = [];
    let countProviderSelected = 0;

    listCutomersId.map(customer => {
      const tag = {};
      tag.key = this.state.providerId + "_" + customer.Ident;
      tag.relation = "=";
      tag.value = "1";
      if (countProviderSelected > 0) {
        const or = {};
        or.operator = "OR";
        tags.push(or);
      }
      countProviderSelected++;
      return tags.push(tag);
    });

    notification.tags = tags;
    return notification;
  };

  getColumnsCustomers = customersParam => {
    const columns = [];
    if (Object.keys(customersParam).length > 0) {
      Object.keys(customersParam[0]).forEach(key => {
        if (key !== "_id") {
          if (key === "Ident") {
            columns.push({
              accessor: key,
              Header: key,
              show: false
            });
          } else {
            columns.push({
              accessor: key,
              Header: key
            });
          }
        }
      });
    }
    return columns;
  };

  getDataCustomers = customersParam => {
    const data = customersParam.map(item => {
      const _id = new Chance().guid();
      return {
        _id,
        ...item
      };
    });
    return data;
  };

  sendMessage = () => {
    this.setState({ errorMessage: "", isLoading: true });
    let errorMessage = "";
    let bodyNotification = this.builderPushNotification();

    if (
      bodyNotification.tags === "undefined" ||
      bodyNotification.tags.length === 0
    ) {
      errorMessage = "* Pelo menos um cliente precisa ser selecionado.";
    }
    if (
      bodyNotification.title === "undefined" ||
      bodyNotification.title.trim() === ""
    ) {
      if (errorMessage.length > 0) {
        errorMessage += "\n";
      }
      errorMessage += "* O campo título precisa ser informado";
    }

    if (
      bodyNotification.message === "undefined" ||
      bodyNotification.message.trim() === ""
    ) {
      if (errorMessage.length > 0) {
        errorMessage += "\n";
      }
      errorMessage += "* O campo Conteúdo precisa ser informado";
    }
    if (errorMessage.length > 0) {
      this.setState({ errorMessage, isLoading: false });
      window.scrollTo(0, 0);
    } else {
      post(sendNotificationAPI, bodyNotification, function(resp) {
        const result = JSON.parse(resp);
        let messageAlert = "";
        if (result.code === 200) {
          messageAlert = "Notificações enviadas com sucesso.";
        } else if (result.code === 406) {
          messageAlert =
            "Um ou mais clientes não estão logados no Aplicativo, apenas usuários logados conseguem receber as notificações em forma de Push. Porém a mensagem será exibida na tela de notificação.";
        } else {
          messageAlert =
            "Erro ao tentar enviar notificações, por favor tente novamente.";
        }
        showMessageOK("", messageAlert, () => {
          window.location.reload();
          this.setState({ isLoading: false });
        });
      });
    }
  };

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  handleChangeMessage(event) {
    this.setState({ message: event.target.value });
  }

  handleChangeDefaultMessage(event) {
    this.defaultMessageSelected = getElementById(
      this.state.listDefaultMessages,
      event.target.value
    );

    if (this.defaultMessageSelected !== undefined) {
      this.setState({ title: this.defaultMessageSelected.TITULO });
      this.setState({ message: this.defaultMessageSelected.DESCRICAO });
    } else {
      this.setState({ title: "" });
      this.setState({ message: "" });
    }
  }

  handleSubmit(event) {
    this.builderPushNotification();
    event.preventDefault();
  }

  handleBlockOpenOS(event) {
    this.setState({ blockOpenNewOS: !this.state.blockOpenNewOS });
  }

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
    if (columns === undefined) {
      columns = [];
    }
    const checkboxProps = {
      selectAll,
      isSelected,
      toggleSelection,
      toggleAll,
      selectType: "checkbox",
      getTrProps: (s, r) => {
        const selected = this.isSelected(r.original._id);
        return {
          style: {
            backgroundColor: selected ? "lightgreen" : "inherit"
          }
        };
      }
    };

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
            <div className="text-center">
              <h4 className="title bold">Envio de mensagens para clientes</h4>
            </div>
            <div>
              <div align="right" className="topnav search-container">
                {this.state.isLoading ? (
                  <Spinner styleCss="d-flex justify-content-end" />
                ) : (
                  <button
                    onClick={this.sendMessage}
                    type="button"
                    id="buttonAction"
                    className="btn btn-primary"
                  >
                    Enviar Mensagem
                  </button>
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="wrapper right">
                <div className="right" />
              </div>
            </div>
            <div align="right" className="topnav search-container margin10">
              <label className="bold">Sugestões:{"\u00A0"} </label>
              <select
                className=".form-control right"
                onChange={this.handleChangeDefaultMessage}
                value={this.defaultMessage}
              >
                <option>
                  {"Selecione uma sugestão ou informe o texto manual"}
                </option>
                {this.state.listDefaultMessages.map(item => (
                  <option key={item.ID} value={item.ID}>
                    {item.TITULO}
                  </option>
                ))}
              </select>
            </div>
            <div className="container">
              <div className="form-group bold">
                <label htmlFor="title">Título</label>
                <input
                  value={this.state.title}
                  onChange={this.handleChangeTitle}
                  type="text"
                  className="form-control"
                  id="titleModal"
                  aria-describedby="titleHelp"
                  placeholder="Informe o título da mensagens"
                  required
                />
                <small id="titlelHelp" className="form-text text-muted">
                  * Esta informação é obrigatória, informe o assunto da mensagem
                </small>
              </div>
              <div className="form-group bold">
                <label>Conteúdo</label>
                <textarea
                  value={this.state.message}
                  onChange={this.handleChangeMessage}
                  rows="3"
                  className="form-control"
                  id="conteudoModal"
                  aria-describedby="conteudoHelp"
                  placeholder="Informe o conteúdo da mensagem"
                  required
                />
                <small id="conteudoHelp" className="form-text text-muted">
                  * Esta informação é obrigatória, informe a mensagem que será
                  enviada
                </small>
              </div>
              <div className="textBlock form-group bold">
                <input
                  type="checkbox"
                  defaultChecked={this.state.blockOpenNewOS}
                  onChange={this.handleBlockOpenOS}
                />
                <label className="margin10">
                  Bloquear abertura de OSs para os clientes selecionados
                </label>
              </div>
              <CheckboxTable
                ref={r => (this.checkboxTable = r)}
                filterable={true}
                defaultFilterMethod={this.defaultFilter}
                minRows={0}
                data={this.state.customersFiltered}
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
          </div>
        )}
      </form>
    );
  }
}
export default SendNotification;

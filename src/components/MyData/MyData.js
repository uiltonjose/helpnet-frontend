import React, { Component } from "react";
import Api from "../../util/Endpoints";
import { unavailableServiceAlert } from "../../util/AlertDialogUtil";
import { failSyncronizedCustomers } from "../../util/AlertDialogUtil";
import { showMessageOK } from "../../util/AlertDialogUtil";
import Spinner from "../ui/Spinner";
import { get } from "../../util/RequestUtil";
const FileUtil = require("../../util/FileUtil");
const syncronizedCustomersFromFile = Api.syncronizedCustomersFromFile;

class MyData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      selectedFileName: "Nenhum arquivo selecionado",
      errorMessage: "",
      isLoading: false
    };
  }

  finishedProcess() {
    this.setState({
      isLoading: false,
      selectedFileName: "Nenhum arquivo selecionado"
    });
  }

  componentWillMount() {
    const savedUserInfo = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(savedUserInfo);
    this.setState({
      userInfo
    });
  }

  onClickHandler = () => {
    this.setState({ isLoading: true });
    if (FileUtil.getExtensionFromFile(this.state.selectedFileName) === "zip") {
      FileUtil.getContentFromFileZipped(this.state.selectedFile).then(
        content => {
          this.handleFileRead(content);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      FileUtil.getContentFromFile(this.state.selectedFile).then(
        content => {
          this.handleFileRead(content);
        },
        error => {
          console.log(error);
        }
      );
    }
  };

  handleFileRead = content => {
    if (content === null) {
      failSyncronizedCustomers(() => {
        this.setState({ isLoading: false });
      });
    } else {
      let linhas = content.split("\n");
      let dataFromFile = "";
      let i = 0;

      while (i < linhas.length && dataFromFile === "") {
        const lineIdentifier = "INSERT INTO `sis_cliente` VALUES (";
        if (linhas[i].substring(0, 34) === lineIdentifier) {
          dataFromFile = linhas[i];
        }
        i++;
      }
      if (dataFromFile === "") {
        failSyncronizedCustomers(() => {
          this.setState({ isLoading: false });
        });
      } else {
        const fileName = FileUtil.getFileName(
          this.state.userInfo["provedor_id"]
        );
        FileUtil.uploadFileToAWS(fileName, dataFromFile).then(
          result => {
            console.log(result);
            this.syncronizedCustomersFromFile();
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  };

  syncronizedCustomersFromFile = () => {
    const providerId = this.state.userInfo["provedor_id"];
    this.setState({ providerId });
    const url = `${syncronizedCustomersFromFile}${providerId}`;
    get(url).then(resp => {
      if (resp) {
        if ((resp.code = 200)) {
          showMessageOK(
            "Atualização concluída",
            "A atualização dos clientes foi realizada com sucesso",
            () => {
              this.finishedProcess();
            }
          );
        } else {
          failSyncronizedCustomers(() => {
            this.finishedProcess();
          });
        }
      } else {
        unavailableServiceAlert(() => {
          this.finishedProcess();
        });
      }
    });
  };

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      selectedFileName: event.target.files[0].name,
      loaded: 0
    });
  };

  render() {
    return (
      <div>
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
            <div className="form-group bold">
              <label>Informe o arquivo de backup do seu provedor</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroupFileAddon01">
                    Upload
                  </span>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    accept=".zip"
                    className="custom-file-input"
                    id="inputGroupFile01"
                    aria-describedby="inputGroupFileAddon01"
                    onChange={this.onChangeHandler}
                  />
                  <label
                    className="custom-file-label"
                    htmlFor="inputGroupFile01"
                  >
                    {this.state.selectedFileName}
                  </label>
                </div>
              </div>
            </div>

            <div align="right" className="topnav search-container">
              <div>
                <button
                  type="button"
                  className="btn btn-success btn-block"
                  onClick={this.onClickHandler}
                >
                  Iniciar atualização
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MyData;

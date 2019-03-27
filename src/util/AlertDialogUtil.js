import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export const showMessageOKCancel = (
  title,
  message,
  okListener,
  cancelLister
) => {
  confirmAlert({
    title: title,
    message: message,
    buttons: [
      {
        label: "Sim",
        onClick: () => okListener()
      },
      {
        label: "Não",
        onClick: () => cancelLister()
      }
    ]
  });
};

export const showMessageOK = (title, message, okListener) => {
  confirmAlert({
    title: title,
    message: message,
    buttons: [
      {
        label: "Ok",
        onClick: () => okListener()
      }
    ]
  });
};

export const unavailableServiceAlert = okListener => {
  confirmAlert({
    title: "",
    message:
      "O serviço está indisponível, por favor tente novamente. Caso o problema volte ocorrer, entre em contato com o suporte.",
    buttons: [
      {
        label: "OK",
        onClick: () => okListener()
      }
    ]
  });
};

export const failLoadOsList = okListener => {
  confirmAlert({
    title: "",
    message:
      "Falha ao tentar carregar a lista das Ordem de Serviços. Por favor tente novamente. Caso o problema volte ocorrer, entre em contato com o suporte.",
    buttons: [
      {
        label: "OK",
        onClick: () => okListener()
      }
    ]
  });
};

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

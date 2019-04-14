import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { firebaseApp } from "../../firebase";

const logoutHandler = history => {
  firebaseApp
    .auth()
    .signOut()
    .then(() => {
      localStorage.clear();
      history.push("/");
    });
};

export const showModalLogout = history => {
  confirmAlert({
    title: "",
    message: "Tem certeza que deseja sair?",
    buttons: [
      {
        label: "Sim",
        onClick: () => logoutHandler(history)
      },
      {
        label: "Não",
        onClick: () => console.log("close dialog")
      }
    ]
  });
};

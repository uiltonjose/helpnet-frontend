import React, { Component } from "react";
import firebase from "firebase/app";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCxsIsHEq2QZOdSmrCG5LpQeqY-wQW5_u4",
  authDomain: "helpnet-3a519.firebaseapp.com",
  databaseURL: "https://helpnet-3a519.firebaseio.com",
  projectId: "helpnet-3a519",
  storageBucket: "helpnet-3a519.appspot.com",
  messagingSenderId: "550379662303"
};
firebase.initializeApp(config);

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = { teste: "" };
  }
  render() {
    return <div />;
  }
}

export default Upload;
/*
    const url = "https://helpnetws.herokuapp.com/api/listProviders";
    var xhr = super.createCORSRequest("GET", url);
    if (!xhr) {
      throw new Error("CORS not supported");
    }

    fetchListProvider(url, function(resp) {
      console.log("Response Get Async...");
      const providers = JSON.parse(resp);

      //Create and append select list
      selectList.id = "mySelect";
      providerContent.appendChild(selectList);

      //Create and append the options
      for (let i = 0; i < providers.length; i++) {
        const option = document.createElement("option");
        option.value = providers[i].ID;
        option.text = providers[i].NOME;
        selectList.appendChild(option);
      }
    });

    function fetchListProvider(theUrl, callback) {
      const xmlHttp = createCORSRequest("GET", theUrl);
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
          callback(xmlHttp.responseText);
      };
      xmlHttp.open("GET", theUrl, true); // true for asynchronous
      xmlHttp.send(null);
    }

    function createCORSRequest(method, url) {
      var xhr = new XMLHttpRequest();

      if ("withCredentials" in xhr) {
        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest !== "undefined") {
        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        // Otherwise, CORS is not supported by the browser.
        xhr = null;
      }
      return xhr;
    }

    body = (
      <div id="container">
        <div>
          <input
            type="file"
            accept="image/*"
            capture="camera"
            id="fileButton"
            value="upload"
          >
            {" "}
          </input>
          <progress value="0" max="100" id="uploader">
            0%
          </progress>
          <p id="downloadOutput" />
          <img id="imageOutput" style="width:80px" />
          <p id="hiddenUrl" hidden />
          <p id="statusUpload" />
        </div>

        <div id="providerContent"> </div>

        <div>
          <input
            type="button"
            onclick="updateProvider()"
            value="Update Provider"
            id="fileButton2"
          >
            {" "}
          </input>
        </div>
      </div>
    );
  }

  updateProvider() {
    // Get elements
    let docu = new Document(body);
    const uploader = document.getElementById("uploader");
    const fileUpload = docu.getElementById("fileButton");
    const providerContent = document.getElementById("providerContent");
    const selectList = document.createElement("select");

    // Listen for file selection
    fileUpload.addEventListener("change", function(e) {
      // Get File
      const file = e.target.files[0];

      // Create a storage ref
      const storageRef = firebase.storage().ref("provider/" + file.name);

      // Upload File
      const metadata = { contentType: file.type };
      const task = storageRef.put(file, metadata);

      // Update progress bar
      task.on(
        "state_changed",
        function progress(snapshot) {
          let percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          uploader.value = percentage;
        },

        function error(err) {
          console.log(err);
        },

        function complete() {
          console.log("Upload completed successfully.");
          document.getElementById("uploader").style.visibility = "hidden";

          task.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {
            console.log(url);

            const downloadLink = "Link to Download";
            const result = downloadLink.link(url);
            document.getElementById("downloadOutput").innerHTML = result;
            document.getElementById("hiddenUrl").innerHTML = url;
            document.getElementById("imageOutput").src = url;
          });
        }
      );
    });
  }
  // teste

  updateProvider() {
    const mySelect = document.getElementById("mySelect");
    const selectedProvider = mySelect.options[mySelect.selectedIndex].value;
    const urlLogo = document.getElementsByTagName("p")[1].innerHTML;

    var a = "a";

    const apiUrl = "https://helpnetws.herokuapp.com/api/updateProvider";
    var xhr = createCORSRequest("PUT", apiUrl);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {
      let messageResult =
        "Erro ao tentar atualizar as informações do Provedor.";
      if (xhr.readyState === 4 && xhr.status === 200) {
        messageResult = "Provedor atualizado com sucesso!";
      }
      document.getElementById("statusUpload").innerHTML = messageResult;
    };

    let providerObj = {};
    providerObj.logo = urlLogo;
    providerObj.providerId = selectedProvider;
    const data = JSON.stringify(providerObj);
    xhr.send(data);
  }

  render() {
    return body;
  }
}


*/

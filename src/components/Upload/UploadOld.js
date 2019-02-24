function fetchListProvider(theUrl, callback) {
  const xmlHttp = createCORSRequest("GET", theUrl);
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

const url = "https://helpnetws.herokuapp.com/api/listProviders";
fetchListProvider(url, function(resp) {
  console.log("Response Get Async...");

  const providers = JSON.parse(resp);
  const providerContent = document.getElementById("providerContent");

  //Create and append select list
  const selectList = document.createElement("select");
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

// Get elements
const uploader = document.getElementById("uploader");
const fileUpload = document.getElementById("fileButton");

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
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

function updateProvider() {
  const mySelect = document.getElementById("mySelect");
  const selectedProvider = mySelect.options[mySelect.selectedIndex].value;
  const urlLogo = document.getElementsByTagName("p")[1].innerHTML;

  const apiUrl = "https://helpnetws.herokuapp.com/api/updateProvider";
  const xhr = createCORSRequest("PUT", apiUrl);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function() {
    let messageResult = "Erro ao tentar atualizar as informações do Provedor.";
    if (xhr.readyState == 4 && xhr.status == 200) {
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

function createCORSRequest(method, url) {
  const xhr = new XMLHttpRequest();

  if ("withCredentials" in xhr) {
    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
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

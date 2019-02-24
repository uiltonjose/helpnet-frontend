const SERVER_HOST = process.env.REACT_APP_SERVER_URL;

const createCORSRequest = (method, url) => {
  return new XMLHttpRequest();
};

const httpRequest = (method, url, body, callback) => {
  console.log(url);
  const xmlHttp = createCORSRequest(method, url);
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        callback(xmlHttp.responseText);
      } else {
        callback(xmlHttp.response);
      }
    }
  };
  xmlHttp.open(method, url, true); // true for asynchronous
  xmlHttp.setRequestHeader("Content-Type", "application/json");
  xmlHttp.send(JSON.stringify(body));
};

const getEndpoint = api => {
  return SERVER_HOST + api;
};

export const get = (url, callback) => {
  httpRequest("GET", getEndpoint(url), null, callback);
};

export const post = (url, body, callback) => {
  httpRequest("POST", getEndpoint(url), body, callback);
};

export const put = (url, body, callback) => {
  httpRequest("PUT", getEndpoint(url), body, callback);
};

const axios = require("axios");
const SERVER_HOST = process.env.REACT_APP_SERVER_URL;

const getEndpoint = api => {
  return `${SERVER_HOST}${api}`;
};

const getHeaderAuthorization = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      headers: {
        Authorization: token
      }
    };
  }
  return {};
};

export const get = api => {
  const header = getHeaderAuthorization();
  return axios.get(getEndpoint(api), header);
};

export const post = (api, body) => {
  const header = getHeaderAuthorization();
  return axios.post(getEndpoint(api), body, header);
};

export const put = (api, body) => {
  const header = getHeaderAuthorization();
  return axios.put(getEndpoint(api), body, header);
};

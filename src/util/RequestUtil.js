const axios = require("axios");
const SERVER_HOST = process.env.REACT_APP_SERVER_URL;

const endpoint = axios.create({
  baseURL: SERVER_HOST
});

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
  return endpoint.get(api, header);
};

export const post = (api, body) => {
  const header = getHeaderAuthorization();
  return endpoint.post(api, body, header);
};

export const put = (api, body) => {
  const header = getHeaderAuthorization();
  return endpoint.put(api, body, header);
};

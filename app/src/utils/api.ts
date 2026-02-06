import axios from "axios";

import config from "./config";

const apiInstance = axios.create({
  baseURL: `${config.apiURL}`,
  withCredentials: true,
  headers: {
    id: config.apiKey,
  },
});

export { apiInstance };

import axios from "axios";

axios.defaults.withCredentials = true;
const API = axios.create({
  baseURL: `/api`,
  withCredentials: true,
});

export default API;

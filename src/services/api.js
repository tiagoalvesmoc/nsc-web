import axios from "axios";

const api = axios.create({
  baseURL: "https://ws-nsc.herokuapp.com/",
});
export default api;

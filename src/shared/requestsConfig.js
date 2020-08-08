import Axios from "axios";

const instance = Axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  headers: {
      "Content-Type": "application/json"
  }
});

export default instance;

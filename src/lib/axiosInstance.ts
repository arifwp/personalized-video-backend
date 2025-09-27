import axios from "axios";
import "dotenv/config";

const api = axios.create({
  baseURL: `${process.env.SYNCLABS_API_URL}`,
  headers: {
    "x-api-key": process.env.SYNCLABS_API_KEY as string,
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

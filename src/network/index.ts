import { keys } from "../config";
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: keys.API_URL,
})
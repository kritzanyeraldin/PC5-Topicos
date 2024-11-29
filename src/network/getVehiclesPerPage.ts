import { axiosInstance } from "./index";

export const getVehiclesPerPageVehicles = async (page: number) => {
    const response = await axiosInstance.get(`/vehiculos?page=${page}`);
    return response.data;
};  


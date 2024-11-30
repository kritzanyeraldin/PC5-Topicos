import { axiosInstance } from './index'
// import data from '../mocks/data.json'
export const getVehiclesPerPageVehicles = async (page: number) => {
	const response = await axiosInstance.get(`/vehiculos?page=${page}   `)
	return response.data
	// console.log('page:', page)
	// return data.data
}

//&limit=50?

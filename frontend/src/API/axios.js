import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

export const getFoodSales = async (pageIndex,pageSize) => {
    const response = await axios.get(`${apiUrl}/FoodSale?pageIndex=${pageIndex}&pageSize=${pageSize}`);
    return response.data;
};

export const createFoodSale = async (foodSale) => {
    const response = await axios.post(`${apiUrl}/FoodSale`, foodSale);
    return response.data;
};

export const updateFoodSale = async (id, foodSale) => {
    await axios.put(`${apiUrl}/FoodSale/${id}`, foodSale);
};

export const deleteFoodSale = async (id) => {
    await axios.delete(`${apiUrl}/FoodSale/${id}`);
};

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api", // Make sure this matches your backend port
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
API.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url);
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log('API response from:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.error('API response error:', error.response?.status, error.response?.data || error.message);
    if (error.response && error.response.status === 401) {
      // If unauthorized, redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard
export const getDashboardStats = () => API.get("/dashboard");

// Items
export const getItems = () => API.get("/items");
export const getItemById = (id) => API.get(`/items/${id}`);
export const createItem = (data) => API.post("/items", data);
export const updateItem = (id, data) => API.put(`/items/${id}`, data);
export const deleteItem = (id) => API.delete(`/items/${id}`);
export const getItemsWithStock = () => API.get("/items/with-stock");

// Suppliers
export const getSuppliers = () => API.get("/suppliers");
export const getSupplierById = (id) => API.get(`/suppliers/${id}`);
export const createSupplier = (data) => API.post("/suppliers", data);
export const updateSupplier = (id, data) => API.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => API.delete(`/suppliers/${id}`);

// Warehouses
export const getWarehouses = () => API.get("/warehouses");
export const getWarehouseById = (id) => API.get(`/warehouses/${id}`);
export const getWarehouseInventory = (id) => API.get(`/inventory/by-warehouse/${id}`);
export const getWarehouseStats = () => API.get("/warehouses/stats");
export const getWarehouseInventoryDistribution = () => API.get("/warehouses/inventory-distribution");
export const createWarehouse = (data) => API.post("/warehouses", data);
export const updateWarehouse = (id, data) => API.put(`/warehouses/${id}`, data);
export const deleteWarehouse = (id) => API.delete(`/warehouses/${id}`);
export const transferInventory = (data) => API.post("/warehouses/transfer", data);

// Tea Varieties
export const getTeaVarieties = () => API.get("/tea-varieties");
export const getTeaVarietyById = (id) => API.get(`/tea-varieties/${id}`);
export const createTeaVariety = (data) => API.post("/tea-varieties", data);
export const updateTeaVariety = (id, data) => API.put(`/tea-varieties/${id}`, data);
export const deleteTeaVariety = (id) => API.delete(`/tea-varieties/${id}`);

// Reports & Notifications
export const getMonthlyReport = () => API.get("/reports/monthly");
export const getReorders = () => API.get("/reorders");
export const updateReorderStatus = (id, status) => API.put(`/reorders/${id}`, { status });
export const getNotifications = () => API.get("/notifications");

// Inventory flow
export const getInventoryFlow = () => API.get("/inventory-flow");

export default API;
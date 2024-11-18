import axios from "axios";
import { BASE_URL } from "../config";


const Department_API_BASE_URL = `${BASE_URL}/Department`;

const DepartmentService = {
    getDepartments: async (page = 1, pageSize = 10, searchQuery = '') => {
        try {
           // const response = await axios.get(`${API_BASE_URL}?page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}`);
           const response = await axios.get(`${Department_API_BASE_URL}?page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Departments:', error);
            throw error;
        }
    },

    addDepartment: async (departmentData) => {
        try {
          const response = await axios.post(Department_API_BASE_URL, departmentData);
          return response.data;
        } catch (error) {
          console.error("Error adding department:", error);
          throw error;
        }
      },

      updateDepartment: async (id, updateData) => {
        try {
          const response = await axios.put(`${Department_API_BASE_URL}/${id}`, updateData);
          return response.data;
        } catch (error) {
          console.error("Error updating department:", error);
          throw error;
        }
      },

      deleteDepartment: async (id) => {
        try {
          const response = await axios.delete(`${Department_API_BASE_URL}/${id}`);
          return response.data; 
        } catch (error) {
          console.error('Error deleting department:', error);
          throw error; 
        }
      },
}

export default DepartmentService;
import axios from "axios";
import { BASE_URL } from "../config";

const Employee_API_BASE_URL = `${BASE_URL}/Employee`;

const EmployeeService = {
    getEmployees: async (page = 1, pageSize = 10, searchQuery = '') => {
        try {
            const response = await axios.get(`${Employee_API_BASE_URL}?page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    },

    addEmployee: async (employeeData) => {
        try {
          const response = await axios.post(Employee_API_BASE_URL, employeeData);
          return response.data;
        } catch (error) {
          console.error("Error adding employee:", error);
          throw error;
        }
      },

    updateEmployee: async (id, updateData) => {
        try {
          const response = await axios.put(`${Employee_API_BASE_URL}/${id}`, updateData);
          return response.data;
        } catch (error) {
          console.error("Error updating employee:", error);
          throw error;
        }
      },

      deleteEmployee: async (id) => {
        try {
          const response = await axios.delete(`${Employee_API_BASE_URL}/${id}`);
          return response.data; 
        } catch (error) {
          console.error('Error deleting employee:', error);
          throw error; 
        }
      },
}

export default EmployeeService;

    
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import EmployeePage from '../pages/EmployeePage';
import DepartmentPage from '../pages/DepartmentPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="/department" element={<DepartmentPage />} />
        </Routes>
    );
};

export default AppRoutes;
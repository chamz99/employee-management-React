import React, { useState, useEffect } from 'react';
import EmployeeService from '../../services/EmployeeService';
import DepartmentService from '../../services/DepartmentService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const EmployeeModal = ({ onClose,show, refreshEmployees, mode,employeeData}) => {

  const [departments, setDepartments] = useState([]);
  const [employeeForm, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth:'',
    age:'',
    salary: '',
    departmentId: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    console.log(employeeData);
    if(mode === 'add'){
      setEmployee({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth:'',
        age:'',
        salary: '',
        departmentId: '',
      });
    }
    if (mode === 'edit' && employeeData) {

      const formattedDateOfBirth = new Date(employeeData.dateOfBirth).toLocaleDateString('en-CA');  // 'en-CA' gives YYYY-MM-DD format
      setEmployee({
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        dateOfBirth: formattedDateOfBirth,
        age: calculateAge(employeeData.dateOfBirth),
        salary: employeeData.salary,
        departmentId: employeeData.departmentId,
      });
    }
  }, [mode, employeeData]);

  const fetchDepartments = async () => {
    
    try{
        const data = await DepartmentService.getDepartments();
        console.log(data);
       
        setDepartments(data);

    }catch(error){
        console.error('Error fetching Departments:', error);
    }
};
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employeeForm, [name]: value });

    if(name === "dateOfBirth"){
        const calculatedAge = calculateAge(value);
        setEmployee((prev) => ({ ...prev, age: calculatedAge }));
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
    
  };

  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const validate = () => {
    const newErrors = {};
    if (!employeeForm.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }
    if (!employeeForm.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }
    if (!employeeForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(employeeForm.email)) {
      newErrors.email = 'Invalid Email format';
    }
    if (!employeeForm.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of Birth is required';
    }
    if (!employeeForm.salary) {
      newErrors.salary = 'Salary is required';
    }else if(employeeForm.salary <= 0){
      newErrors.salary = 'Salary must be greater than 0';
    }
         
    if (!employeeForm.departmentId) {
      newErrors.departmentId = 'Department is required';
    }
    return newErrors;
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    const validationErrors = validate();
    console.log(validationErrors);
    setErrors(validationErrors);

    
    if(Object.keys(validationErrors).length === 0){
      try{
        if(mode === 'edit'){
          await EmployeeService.updateEmployee(employeeData.id, employeeForm);
          toast.success('Employee updated Succesfully!', {
            position: 'top-right',
          });
          
          
        }
        else if(mode === 'add'){
          await EmployeeService.addEmployee(employeeForm);
          toast.success('Employee added  successfully!', {
            position: 'top-right',
          });
          
        }
        refreshEmployees();
  
      }catch(error){
          console.error("Error submitting Employee" , error);
          toast.error('Failed to Submiting Employee', {
            position: 'top-right',
          });
         
      }
      finally{
          onClose(); 
      }
    }
    
    
  };

 

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{mode === 'add' ? 'Add Employee' : 'Edit Employee'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
                <div className="row">
                <div className="mb-3 col-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={employeeForm.firstName}
                  onChange={handleChange}
                  className="form-control"
                  
                />
                 {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
              </div>
              <div className="mb-3 col-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={employeeForm.lastName}
                  onChange={handleChange}
                  className="form-control"
                  
                />
                {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
              </div>
                </div>
              
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={employeeForm.email}
                  onChange={handleChange}
                  className="form-control"
                  
                />
                 {errors.email && <div className="text-danger">{errors.email}</div>}
              </div>
              <div className="row">
                <div className="mb-3 col-6">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={employeeForm.dateOfBirth}
                  onChange={handleChange}
                  className="form-control"
                  
                />
                 {errors.dateOfBirth && <div className="text-danger">{errors.dateOfBirth}</div>}
              </div>
              <div className="mb-3 col-6">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="age"
                  value={employeeForm.age}
                  onChange={handleChange}
                  className="form-control"
                 readOnly
                />
              </div>
                </div>
              <div className="mb-3">
                <label className="form-label">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={employeeForm.salary}
                  onChange={handleChange}
                  className="form-control"
                  
                />
                {errors.salary && <div className="text-danger">{errors.salary}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Department</label>
                <select
                  name="departmentId"
                  value={employeeForm.departmentId}
                  onChange={handleChange}
                  className="form-control"
                  
                >
                  <option value="">... Select Department ...</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && <div className="text-danger">{errors.departmentId}</div>}
              </div>
              <button type="submit" className="btn btn-success">
                {mode === 'add' ? 'Save' : 'Update'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;

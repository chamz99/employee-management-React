import React, { useState, useEffect } from 'react';
import DepartmentService from '../../services/DepartmentService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


const DepartmentModal = ({ onClose,show, refreshDepartments, mode, departmentData }) => {
  const [departmentForm, setDepartment] = useState({
    code: '',
    name: '',
  });

  const [errors, setErrors] = useState({});

  
  useEffect(() => {
    if(mode === 'add'){
        setDepartment({
            code: '',
            name: '',
      });
    }
    if (mode === 'edit' && departmentData) {
      setDepartment({
       code: departmentData.code,
        name: departmentData.name,
       
      });
    }
  }, [mode, departmentData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...departmentForm, [name]: value });

    setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
  };

  const validate = () => {
    const newErrors = {};
    if (!departmentForm.code.trim()) {
      newErrors.code = 'Department Code is required';
    }
    if (!departmentForm.name.trim()) {
      newErrors.name = 'Department Name is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    
    if(Object.keys(validationErrors).length === 0){
        try{
            if(mode === 'edit'){
                await DepartmentService.updateDepartment(departmentData.id, departmentForm);
                toast.success('Department updated Succesfully!', {
                    position: 'top-right',
                  });
                
            }
            else if(mode === 'add'){
            await DepartmentService.addDepartment(departmentForm);
            toast.success('Department added  successfully!', {
                position: 'top-right',
              });
            }
            refreshDepartments();
           
    
        }catch(error){
            console.error("Error while Submitting Department" , error);
            toast.error('Failed to Submiting Department', {
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
            <h5 className="modal-title">{mode === 'add' ? 'Add Department' : 'Edit Department'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>             
              <div className="mb-3">
                <label className="form-label">Department Code</label>
                <input
                  type="text"
                  name="code"
                  value={departmentForm.code}
                  onChange={handleChange}
                  className="form-control"
                  
                />
                {errors.code && <div className="text-danger">{errors.code}</div>}
              </div>
              
              <div className="mb-3">
                <label className="form-label">Department Name</label>
                <input
                  type="text"
                  name="name"
                  value={departmentForm.name}
                  onChange={handleChange}
                  className="form-control"
                 
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
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

export default DepartmentModal;

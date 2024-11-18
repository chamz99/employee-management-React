import React, { useEffect, useState, useMemo } from 'react';
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import EmployeeModal from '../components/modals/EmployeeModal.js'
import EmployeeService from '../services/EmployeeService.js';

import { toast } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.css';

 
const EmployeePage = () => {

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);     
    const [modalType, setModalType] = useState('add'); 
    const [showModal, setShowModal] = useState(false);       
   
  
    useEffect(() => {
        fetchEmployees();
      }, []);
    
      const fetchEmployees = async () => {
       
        try{
            const data = await EmployeeService.getEmployees();
            setEmployees(data);

        }catch(error){
            console.error('Error fetching employees:', error);
        }
    };

    const columns = useMemo(
        () => [
        
          { Header: 'Name', accessor: (row) => `${row.firstName} ${row.lastName}` },
          { Header: 'Email', accessor: 'email' },
          { Header: 'Date of Birth', accessor: 'dateOfBirth',
            Cell: ({ value }) => {
              
              const formattedDate = new Date(value).toLocaleDateString('en-CA');  
              return <span>{formattedDate}</span>;
            },
           },
          { Header: 'Age', accessor: 'age'},
          { Header: 'Department', accessor: 'departmentName' },
          { Header: 'Salary', accessor: 'salary' },
          { Header: 'Actions', 
            Cell: ({row}) => {
                const handleEdit = () => {
                   
                    setSelectedEmployee(row.original);
                    setModalType('edit');
                    setShowModal(true);


                };
                const handleDelete = () => {
                   const isConfirmed = window.confirm(`Are you sure you want to delete ${row.original.firstName} ${row.original.lastName} ?`);
                   if (isConfirmed) {
                    confirmDelete(row.original.id);
                   }
                   
                };
                return(
                    <div>
                        
                        <button onClick={handleEdit} className="btn btn-primary btn-sm">
                        <i className="bi bi-pencil-fill"></i> 
                        </button>

                        
                        <button onClick={handleDelete} className="btn btn-danger btn-sm ml-2 ms-2">
                        <i className="bi bi-trash3-fill"></i> 
                        </button>
                    </div>    
                );
            }
          }
        ],
        []
      );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        state: { globalFilter },
        setGlobalFilter,
        nextPage,
        previousPage,
        gotoPage,
        setPageSize,
        state: {pageIndex, pageSize},
      } = useTable(
        {
          columns,
          data: employees,
          initialState: { pageIndex: 0, pageSize: 5 },
        },
        useFilters, 
        useGlobalFilter, 
        usePagination 
      );

      ;

    const handleOpenModal = () => {
       
      setShowModal(true);
      setModalType('add');
    }
    const handleCloseModal = () => setShowModal(false);

    const confirmDelete = async (id) => {
      try {
        await EmployeeService.deleteEmployee(id);
        toast.success('Employee deleted successfully!', {
          position: 'top-right',
        });
       
        
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee.', {
          position: 'top-right',
        });
       
      }
       
    };

      return (
        <div className="container employee-page mt-2 px-3 py-2">
            <h3>Employee List</h3>
            <div className="row mb-3">
                <div className="col-6">
                <input
                    type="text"
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="form-control"
                    placeholder="Search Employee..."
                />
                </div>
                <div className="col-6 text-end">
                    <button className="btn btn-success" onClick={handleOpenModal}>Add Employee</button>
                </div>
                {showModal && <EmployeeModal onClose={handleCloseModal}  show={showModal} refreshEmployees={fetchEmployees} mode={modalType} employeeData={selectedEmployee}/>}
               
            </div>
        <div className="table-container">
        <table className="table employee-table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
        </div>
     

    
     
      <div className="d-flex justify-content-center mt-2">
        <div className="d-flex me-3">
          <span className="me-2 mt-2">Show</span>
          <select
            className="form-control"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{ width: '50px' }}
          >
            {[5, 10, 15, 20].map((size) => (
              <option key={size} value={size}>
                {size} 
              </option>
            ))}
          </select>
          <span className="ms-2 mt-2">Items</span>
     
        </div>
        
        <button
          className="btn btn-secondary"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          Previous
        </button>
        <span className='mx-3 mt-2'>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{' '}
        </span>
        <button
          className="btn btn-secondary"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          Next
        </button>
      </div>

      
    </div>

       
    )
}

export default EmployeePage
import React, { useEffect, useState, useMemo } from 'react';
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import DepartmentService from '../services/DepartmentService.js';
import DepartmentModal from '../components/modals/DepartmentModal.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

 
const DepartmentPage = () => {

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
   // const [pagee, setPage] = useState(1);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [modalType, setModalType] = useState('add'); 
    const [showModal, setShowModal] = useState(false); 

    useEffect(() => {
        fetchDepartments();
      }, []);
    
      const fetchDepartments = async () => {
        setLoading(true);
        try{
            const data = await DepartmentService.getDepartments();
            console.log(data);
           
            setDepartments(data);

        }catch(error){
            console.error('Error fetching Departments:', error);
        }finally{
            setLoading(false);
        }
    };

    const columns = useMemo(
        () => [
       
          { Header: 'Department Code', accessor: 'code' },
          { Header: 'Department Name', accessor: 'name' },
          { Header: 'Actions', 
            Cell: ({row}) => {
                const handleEdit = () => {
                    setSelectedDepartment(row.original);
                    setModalType('edit');
                    setShowModal(true);
                };
                const handleDelete = () => {
                    const isConfirmed = window.confirm(`Are you sure you want to delete Category :  ${row.original.name}?`);
                   if (isConfirmed) {
                    confirmDelete(row.original.id);
                   }
                };
                return(
                    <div>
                        
                        <button onClick={handleEdit} className="btn btn-primary btn-sm">
                        <i class="bi bi-pencil-fill"></i> 
                        </button>

                       
                        <button onClick={handleDelete} className="btn btn-danger btn-sm ml-2 ms-2">
                        <i class="bi bi-trash3-fill"></i> 
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
          data: departments,
          initialState: { pageIndex: 0, pageSize: 5 },
        },
        useFilters, 
        useGlobalFilter, 
        usePagination 
      );

           
    const handleOpenModal = () => {
        setShowModal(true);
        setModalType('add');
    }
    const handleCloseModal = () => setShowModal(false);

    const confirmDelete = async (id) => {
        try {
          await DepartmentService.deleteDepartment(id);
          toast.success('Employee deleted Succesfully!', {
            position: 'top-right',
          });
          
          fetchDepartments();
        } catch (error) {
          console.error('Error deleting department:', error);
          toast.error('Failed to delete Employee', {
            position: 'top-right',
          });
        }
       
        
      };
   

   



    return (
        <div className="container department-page mt-2 px-3 py-2">
            <h3>Department List</h3>
            <div className="row mb-3">
                <div className="col-6">
                <input
                    type="text"
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="form-control"
                    placeholder="Search Department..."
                />
                </div>
                <div className="col-6 text-end">
                    <button className="btn btn-success" onClick={handleOpenModal}>Add Department</button>
                </div>
                {showModal && <DepartmentModal onClose={handleCloseModal}  show={showModal} refreshDepartments={fetchDepartments} mode={modalType} departmentData={selectedDepartment}/>}
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

export default DepartmentPage
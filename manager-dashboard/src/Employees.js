import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import EmployeeDetails from "./EmployeeDetails";
import { useLocation } from 'react-router-dom';

const Employees = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const loggedInManagerId = searchParams.get('managerId');
    const permissionLevel = searchParams.get('permissionLevel');
    const [employeesData, setEmployeesData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [employeeDetailsOpen, setEmployeeDetailsOpen] = useState(false);
    const [managerData, setManagerData] = useState([]);

    const handleCloseForm = () => {
        setEmployeeDetailsOpen(false);
    }

    const handleGoBack = () => {
        window.history.back();
    }

    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
        setEmployeeDetailsOpen(true);
    }

    useEffect(() => {
        fetch('http://localhost:3001/departments')
        .then((response) => response.json())
        .then((data) => {
            setDepartments(data);
            console.log('Fetched departments data:', data);
        })
        .catch((error) => console.log(error));
        
        // Fetch managers from the server/db.json (Replace with the appropriate endpoint)
        fetch(`http://localhost:3001/managers/${loggedInManagerId}`)
        .then((response) => response.json())
        .then((data) => {
            setManagerData(data)
        })
        .catch((error) => console.log(error));
    }, [loggedInManagerId]); 

    useEffect(() => {
        fetch(`http://localhost:3001/employees?accessCode=${managerData.accessCode}`)
        .then((response) => response.json())
        .then((data) => {
            setEmployeesData(data);
            console.log('Fetched employees data:', data);
        })
        .catch((error) => console.log(error));
    }, [managerData]);
    
    return(
        <div>
            <div id="employees-div">
            {employeesData.length < 1 ? (
                <p id='no-department'>No employees.</p>
            ) : (
                <table className='employees-table'>
                <thead>
                    <tr className='table-headers'>
                    <th className='tasks-column-lbl'>ID#</th>
                    <th className='tasks-column-lbl'>Name</th>
                    <th className='tasks-column-lbl'>Department</th>
                    <th className='tasks-column-lbl'>Title</th>
                    </tr>
                </thead>
                <tbody>
                    {employeesData
                    .filter(employee => employee.accessCode === managerData.accessCode)
                    .map(employee => (
                        <tr className='rows' key={employee.id} onClick={() => handleRowClick(employee)}>
                        <td id='employees-id-column'>{employee.id}</td>
                        <td id='employees-name-column'>{`${employee.firstName} ${employee.lastName}`}</td>
                        <td id='employees-department-column'>
                            {employee.department ? departments.find(dept => dept.id === employee.department)?.name : 'No Department'}
                        </td>                    
                        <td id="employees-title-column">{employee.title}</td>
                        </tr>
                    ))}
                </tbody>
                </table>
            )}
            </div>

            {employeeDetailsOpen && (
            <div className="employee-details-for-manager">    
                <EmployeeDetails selectedEmployee={selectedEmployee} permissionLevel={permissionLevel} />
            </div>   
            )}
            {employeeDetailsOpen && (
                <p className="close-icon" id='close-employee-details' onClick={handleCloseForm}>
                    <FaTimes />
                </p>
            )}
            <button className="arrow-icon" onClick={handleGoBack}>
                <FaArrowLeft />
            </button>
        </div>
    );
}

export default Employees;
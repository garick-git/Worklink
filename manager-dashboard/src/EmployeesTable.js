import React, { useState, useEffect } from 'react';
import EmployeeDetails from './EmployeeDetails';
import { FaTimes } from 'react-icons/fa';

const EmployeesTable = ({ employeesData, lockRowClick }) => {
  const [employeeDetailsOpen, setEmployeeDetailsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // useEffect(() => {
  //   console.log('employeesData is: ', employeesData);
  // }, [employeesData])

  const handleCloseForm = () => {
      setEmployeeDetailsOpen(false);
  }
  const handleRowClick = (employee) => {
    if(!lockRowClick){
      setSelectedEmployee(employee);
      setEmployeeDetailsOpen(true);
    }
  }

  return (
    <div>
        <div className="selected-employees-div">
        <table className='selected-employees-table'>
        <thead>
            <tr>
              <th className='tasks-column-lbl'>Employee(s)</th>
            </tr>
          </thead>
          <tbody>
            {employeesData.map((employee) => 
            (
              <tr key={employee.id} onClick = {() => handleRowClick(employee)}>
                <td className='selected-employees-rows'>#{employee.id} {employee.firstName} {employee.lastName}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
          {employeeDetailsOpen && (
              <EmployeeDetails selectedEmployee={selectedEmployee} permissionLevel = {2}/>
          )}
          {employeeDetailsOpen && (
                <p className="close-icon" id='close-employee-table-details' onClick={handleCloseForm}>
                    <FaTimes />
                </p>
            )}
    </div>
  );
};

export default EmployeesTable;
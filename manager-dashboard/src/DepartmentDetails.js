  import React, { useState, useEffect } from 'react';
  import EditDepartment from './EditDepartment';
  import { FaTimes } from 'react-icons/fa';

  const DepartmentDetails = ({ department, loggedInManagerId, employees, managers }) => {
    const [employeeDetails, setEmployeeDetails] = useState([]);
    const [loggedInManagerData, setLoggedInManagerData] = useState(null);
    const [managerFullName, setManagerFullName] = useState('Loading...');
    const [editDepartmentIsOpen, setEditDepartmentIsOpen] = useState(false);

    const handleEditDepartment = () => {
      setEditDepartmentIsOpen(true);
    };

    const handleCloseForm = () => {
      setEditDepartmentIsOpen(false);
    }

    const handleDeleteDepartment = async () => {
      try {
        // Find the employees whose department matches the department being deleted
        console.log('employees: ', employees.filter(employee => department.employees.includes(employee.id)));
        const selectedEmployees = employees.filter(employee => department.employees.includes(employee.id));
    
        // Update the employees' department attribute to null
        selectedEmployees.map((employee) =>
          fetch(`http://localhost:3001/employees/${employee.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...employee, department: null }), // Update the 'department' attribute to null
          })
        );
    
        // Once all the employees have been updated, delete the department
        const deleteResponse = await fetch(`http://localhost:3001/departments/${department.id}`, {
          method: 'DELETE',
        });
    
        const deletedData = await deleteResponse.json();
        console.log('Department deleted:', deletedData);
        
        window.location.reload(); // Reload the page after the department is deleted
      } catch (error) {
        console.log(error);
      }
    };    

    useEffect(() => {
      // Fetch managers from the server/db.json (Replace with the appropriate endpoint)
      fetch(`http://localhost:3001/managers/${loggedInManagerId}`)
        .then((response) => response.json())
        .then((data) => {
          setLoggedInManagerData(data); // Access the manager data if it's nested
          console.log('Fetched manager data:', data);
          console.log('Fetched manager:', loggedInManagerData);
        })
        .catch((error) => console.log(error));
  
      const fetchEmployeeDetails = async () => {
        const response = await Promise.all(
          department.employees.map((employeeId) =>
            fetch(`http://localhost:3001/employees/${employeeId}`).then((response) => response.json())
          )
        );
        const detailsObj = {};
        response.forEach((data) => {
          detailsObj[data.id] = `${data.firstName} ${data.lastName}`;
        });
        setEmployeeDetails(detailsObj);
      };
  
      fetchEmployeeDetails();
  
      // Find and set the name of the department's manager
      if (department.managerId) {
        const manager = managers.find((manag) => manag.id === parseInt(department.managerId));
        if (manager) {
          setManagerFullName(`${manager.firstName} ${manager.lastName}`);
        } else {
          setManagerFullName('Manager Name Not Found');
        }
      } else {
        setManagerFullName('No Department');
      }
    }, [department.employees, loggedInManagerId, department.managerId, managers]);

    return (
      <div id="department-details-div">
        <h2 id="department-form-title">{department.name}</h2>
        <p id="department-details-header">Manager:</p>
        <p id="department-details-manager">{managerFullName}</p>
        <h3 id="department-details-header">Employees:</h3>
        <div className="department-details-table">
          <table className="department-employees-table">
            <tbody>
              {department.employees.map((employeeId, index) => (
                <tr key={index}>
                  <td className="department-employees-row">
                    {employeeDetails[employeeId]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="login-button" id="delete-department-btn" onClick={handleDeleteDepartment}>
          Delete
        </button>
        <button className="login-button" id="edit-department-btn" onClick={handleEditDepartment}>
          Edit
        </button>

        {editDepartmentIsOpen && (
            <div className="edit-department-div">

              <span className="close-icon" id='close-edit-department' onClick={handleCloseForm}>
                  <FaTimes />
              </span>

              <EditDepartment department = {department} loggedInManagerId ={loggedInManagerId}/>
            </div>
          )}
      </div>
    );
  };

  export default DepartmentDetails;
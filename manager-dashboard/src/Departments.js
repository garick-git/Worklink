import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import EmployeesTable from './EmployeesTable'; 
import ManagersTable from './ManagersTable';
import DepartmentDetails from './DepartmentDetails';
import { useParams } from 'react-router-dom';
  
const Departments = () => {
    const { loggedInManagerId = '' } = useParams();
    const [showForm, setShowForm] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [employeesData, setEmployeesData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [managers, setManagers] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [showEmployeesPopup, setShowEmployeesPopup] = useState(false);
    const [selectedEmployeesData, setSelectedEmployeesData] = useState([]);
    const [selectedManagerData, setSelectedManagerData] = useState(null);
    const [employeesTableOpen, setEmployeesTableOpen] = useState(false);
    const [managersTableOpen, setManagersTableOpen] = useState(false);
    const [loggedInManagerData, setLoggedInManagerData] = useState(null);

    useEffect(() => {
    // Fetch employees from the server/db.json
    fetch('http://localhost:3001/employees')
        .then((response) => response.json())
        .then((data) => setEmployees(data))
      .catch((error) => console.log(error));
    
    // Fetch managers from the server/db.json (Replace with the appropriate endpoint)
    fetch(`http://localhost:3001/managers`)
    .then((response) => response.json())
    .then((data) => {
      setManagers(data); // Access the manager data if it's nested
    })
    .catch((error) => console.log(error));

    fetch(`http://localhost:3001/managers/${loggedInManagerId}`)
    .then((response) => response.json())
    .then((data) => {
      setLoggedInManagerData(data);
    })
    .catch((error) => console.log(error));
  }, [])

  useEffect(() => {
    // Fetch departments from the server/db.json
    fetch(`http://localhost:3001/departments?accessCode=${loggedInManagerData?.accessCode}`)
        .then((response) => response.json())
        .then((data) => setDepartments(data))
        .catch((error) => console.log(error));

    if (selectedDepartment) {
      // Fetch employees for the selected department
      fetch(`http://localhost:3001/employees?department=${selectedDepartment.id}`)
        .then((response) => response.json())
        .then((data) => setEmployeesData(data))
        .catch((error) => console.log(error));
        }
  },[loggedInManagerData])

  const handleGoBack = () => {
    window.history.back();
  };

  const handleReload = () => {
    window.location.reload();
  }

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setSelectedEmployeesData([]); 
    setShowEmployeesPopup(false);
    setEmployeesTableOpen(false);
  };  

  const toggleForm = () => {
    if(!selectedDepartment){
      setShowForm((prevShowForm) => !prevShowForm);
    }
  };

  const handleAddEmployees = () => {
    setShowEmployeesPopup(true);
    setEmployeesTableOpen(false);
    setManagersTableOpen(false);
    toggleForm();
  };
  
  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees((prevSelected) => {
      if (prevSelected.includes(employeeId)) {
        return prevSelected.filter((id) => id !== employeeId);
      } else {
        return [...prevSelected, employeeId];
      }
    });
  };

  const handleRowClick = (employeeId) => {
    handleEmployeeSelect(employeeId);
  };

  const handleConfirmEmployees = async () => {
    try {
        const selectedEmployeeObjects = await Promise.all(
            selectedEmployees.map(async (employeeId) => {
                const response = await fetch(`http://localhost:3001/employees/${employeeId}`);
                const employee = await response.json();
                return employee;
            })
        );

        setSelectedEmployeesData(selectedEmployeeObjects);
        setShowEmployeesPopup(false);
        setEmployeesTableOpen(true);
        if(selectedEmployeeObjects.length >= 1)
        {
          toggleForm();
        }
    } catch (error) {
        console.error('Error fetching selected employees:', error);
    }
  };

  const handleFormError = () => {
    toggleForm();
    setEmployeesTableOpen(false);
  }

  const handleCreateDepartment = async () => {
    const departmentName = document.querySelector('.department-form-input').value;
  
    if (!departmentName.trim() || selectedEmployeesData.length < 1) {
      alert('Please fill in all fields.');
      handleFormError();
      return;
    }
    
    const newDepartment = {
      name: departmentName,
      managerId: parseInt(loggedInManagerId),
      employees: selectedEmployeesData.map((employee) => parseInt(employee.id)),
      accessCode: loggedInManagerData?.accessCode
    };
  
    try {
      // Perform the POST request to add the new department
      const response = await fetch('http://localhost:3001/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDepartment),
      });
      const data = await response.json();
  
      // Update the selected employees' department attribute and save them back to the database
      const updatePromises = selectedEmployeesData.map((employee) =>
        fetch(`http://localhost:3001/employees/${employee.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...employee, department: data.id }), // Update department attribute
        })
      );
      await Promise.all(updatePromises);
  
      // Refresh the departments list with the updated data
      setDepartments((prevDepartments) => [...prevDepartments, data]);
      console.log('New Department Added:', data);
      
      setEmployeesTableOpen(false);
      setManagersTableOpen(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    toggleForm();
  };

  const handleCloseForm =() => {
    setSelectedDepartment(false);
    toggleForm();
    setEmployeesTableOpen(false);
  }

  return (
    <div>
      <div className='department-div'>
      {departments.length < 1 ? (
        <p id='no-department'>No departments.</p>
      ) : (
        <table className='department-table'>
          <thead>
            <tr className='table-headers'>
              <th className='tasks-column-lbl'>ID#</th>
              <th className='tasks-column-lbl'>Name</th>
              <th className='tasks-column-lbl'>Employees</th>
              <th className='tasks-column-lbl'>Manager</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr className='rows' key={department.id} onClick={() => handleDepartmentClick(department)}>
                <td className='id-column'>{department.id}</td>
                <td className='name-column'>{department.name}</td>
                <td className='employees-column'>{department.employees.length}</td>
                <td className="manager-column">
                  {department.managerId ? (
                    managers.find((manag) => manag.id === parseInt(department.managerId)) ? 
                    `${managers.find((manag) => manag.id === parseInt(department.managerId))?.firstName} ${managers.find((manag) => manag.id === parseInt(department.managerId))?.lastName}` : 'Manager Name Not Found'
                  ) : (
                    'No Department'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>

      <div className={`popup-form ${showForm ? 'visible' : 'hidden'}`}>
        <span className="close-icon" id='close-new-department' onClick={handleCloseForm}>
                <FaTimes />
        </span>
        <form className='new-department-form' onSubmit={handleSubmit}>
          <h1 id='department-form-title'>New Department</h1>
            <label className='department-form-lbl' id='department-name-lbl'>Department Name</label><br></br>
            <input className='department-form-input'></input><br></br>
            <button className='login-button' id='add-employees-btn' onClick={handleAddEmployees}>Employees</button>
            <br></br>
            {showEmployeesPopup && (
              <div className="popup-employees-form">
                <h2 id='popup-employees-title'>Select Employees</h2>
                <div className="popup-employees-container">
                  <table className='popup-employees-table'>
                    <tbody>
                      {employees
                        .filter((employee) => employee.department === null && employee.accessCode == loggedInManagerData.accessCode)
                        .map((employee) => (
                          <tr key={employee.id} onClick={() => handleRowClick(employee.id)}>
                            <td className='popup-employees-rows'>{`${employee.firstName} ${employee.lastName}`}</td>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedEmployees.includes(employee.id)}
                                onChange={() => handleEmployeeSelect(employee.id)}
                              />
                            </td>   
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className='login-button' id='popup-confirm-employees-btn' onClick={handleConfirmEmployees}>Confirm</button>
              </div>
            )}
          <button onClick={handleReload} className='login-button' id="cancel-department-btn" type="submit">Cancel</button>
          <button onClick={handleCreateDepartment} className='login-button' id="create-department-btn" type="submit">Create</button>
        </form>
        </div>
      
        <button className="arrow-icon" onClick={handleGoBack}>
            <FaArrowLeft />
        </button>
        <button className={`plus-icon ${showForm ? 'visible' : 'hidden'}`} id='plus-icon' onClick={toggleForm}>
            +
        </button>
        {selectedDepartment && (
        <div className="popup">
          <span className="close-icon" id='close-department-details' onClick={handleCloseForm}>
            <FaTimes />
          </span>
          <DepartmentDetails
            department={selectedDepartment}
            loggedInManagerId={loggedInManagerId}
            employees={employees}
            managers={managers}
          />
        </div>
      )}
        {employeesTableOpen && <EmployeesTable employeesData={selectedEmployeesData} lockRowClick={true}/>}
        {managersTableOpen && <ManagersTable managerData={selectedManagerData} />}
    </div>
  );
};

export default Departments;
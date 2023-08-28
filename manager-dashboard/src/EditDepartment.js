import { useState, useEffect } from "react";

const EditDepartment = ( {department, loggedInManagerId} ) => {
    const [showAssignEmployeesPopup, setShowAssignedEmployeesPopup] = useState(false);
    const [showDeleteEmployeesPopUp, setShowDeleteEmployeesPopUp] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [loggedInManagerData, setLoggedInManagerData] = useState(null);
    const [updatedSelectedEmployees, setUpdatedSelectedEmployees] = useState([]);
    const [employeesBeingDeleted, setEmployeesBeingDeleted] = useState([]);

    const handleAssignEmployees = () => {
        setShowAssignedEmployeesPopup(true);
    }

    const handleDeleteEmployees = () => {
        setShowDeleteEmployeesPopUp (true);
    }

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

    const handleConfirmNewEmployees = async () => {
        const selectedEmployeesData = employees.filter((employee) =>
          selectedEmployees.includes(employee.id)
        );
    
        const updatedSelectedEmployees = selectedEmployeesData.map((employee) => ({
          ...employee,
          department: department.id,
        }));
        
        console.log('newly assigned employee is: ', updatedSelectedEmployees);
        setUpdatedSelectedEmployees(updatedSelectedEmployees); // Store in the state variable
        setShowAssignedEmployeesPopup(false);
    };

    const handleConfirmDeletedEmployees = async () => {
        const selectedEmployeesData = employees.filter((employee) =>
          selectedEmployees.includes(employee.id)
        );

        const employeesBeingDeleted = selectedEmployeesData.map((employee) => ({
            ...employee,
            department: null,
          }));
        
        console.log('about to be deleted is: ', employeesBeingDeleted);
        setEmployeesBeingDeleted(employeesBeingDeleted); // Store in the state variable
        setShowDeleteEmployeesPopUp(false);
    };

    const updateAssignedEmployees = (departmentId, newEmployees) => {
        fetch(`http://localhost:3001/departments/${departmentId}`)
          .then((response) => response.json())
          .then((data) => {
            const { name, managerId } = data;
            const employees = [...data.employees, ...newEmployees.map((employee) => employee.id)];
      
            const updatedDepartment = { 
              name: name,
              managerId: managerId,
              employees: employees
            };
      
            fetch(`http://localhost:3001/departments/${departmentId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedDepartment),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Department's updated 'employees' array:", updatedDepartment.employees);
                newEmployees.forEach((employee) => {
                  const updatedEmployee = { ...employee, department: departmentId };
                  fetch(`http://localhost:3001/employees/${employee.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedEmployee),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      console.log(`Employee ID ${employee.id}'s department updated to: ${updatedEmployee.department}`);
                    })
                    .catch((error) => console.log(error));
                });
              })
              .catch((error) => console.log(error));
          })
          .catch((error) => console.log(error));
      };            

      const updateDeletedEmployees = async (departmentId, employees) => {
        // Update the 'department' attribute of each employee in the passed 'employees' array to null
        const updatedEmployees = employees.map((employee) => ({
          ...employee,
          department: null,
        }));
      
        try {
          const response = await fetch(`http://localhost:3001/departments/${departmentId}`);
          const data = await response.json();
      
          const updatedDepartment = {
            ...data,
            employees: data.employees.filter((employeeId) => !employees.some((emp) => emp.id === employeeId)),
          };
    
          const departmentUpdateResponse = await fetch(`http://localhost:3001/departments/${departmentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDepartment),
          });
          const departmentUpdateData = await departmentUpdateResponse.json();
          console.log('Department updated with deleted employees:', departmentUpdateData);
      
          // Update each employee in the passed 'employees' array with the new null department attribute
          for (const employee of updatedEmployees) {
            const employeeUpdateResponse = await fetch(`http://localhost:3001/employees/${employee.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(employee),
            });
            const employeeUpdateData = await employeeUpdateResponse.json();
            console.log(`Employee ID ${employee.id}'s department updated to: ${employee.department}`);
          }
        } catch (error) {
          console.log(error);
        }
    };            

    const handleSubmit = async () => {
        await updateDeletedEmployees(department.id, employeesBeingDeleted);
        updateAssignedEmployees(department.id, updatedSelectedEmployees);
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };      

    useEffect(() => {
        fetch('http://localhost:3001/employees')
          .then((response) => response.json())
          .then((data) => setEmployees(data))
          .catch((error) => console.log(error));
          
      
        fetch(`http://localhost:3001/managers/${loggedInManagerId}`)
          .then((response) => response.json())
          .then((data) => {
            setLoggedInManagerData(data);
          })
          .catch((error) => console.log(error));
      }, []); // Empty dependency array, runs only once on mount      

    return(
        <div className="edit-department-component">
            <h2 id="edit-department-title">Edit Department</h2>
            <button className="login-button" id="edit-department-assign" onClick={handleAssignEmployees}>
                    Assign Employees</button><br></br>
            <button className="login-button" id="edit-department-remove" onClick={handleDeleteEmployees}>
                    Remove Employees</button><br></br>
            <button className="login-button" id= "edit-department-save" onClick={handleSubmit}>
                    Save</button>

            {showAssignEmployeesPopup && (
              <div className="assign-employees-form">
                <h2 id='assign-employees-title'>Assign Employees</h2>
                <div className="assign-employees-container">
                  <table className='assign-employees-table'>
                    <tbody>
                      {employees
                        .filter((employee) => employee.department === null || isNaN(employee.department) && employee.accessCode == loggedInManagerData.accessCode)
                        .map((employee) => (
                          <tr key={employee.id} onClick={() => handleRowClick(employee.id)}>
                            <td className='assign-employees-rows'>{`${employee.firstName} ${employee.lastName}`}</td>
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
                <button className='login-button' id='confirm-assign-employees' onClick={handleConfirmNewEmployees}>Confirm</button>
              </div>
            )}

            {showDeleteEmployeesPopUp && (
              <div className="assign-employees-form">
                <h2 id='assign-employees-title'>Remove Employees</h2>
                <div className="assign-employees-container">
                  <table className='assign-employees-table'>
                    <tbody>
                      {employees
                        .filter((employee) => employee.department === department.id && employee.accessCode == loggedInManagerData.accessCode)
                        .map((employee) => (
                          <tr key={employee.id} onClick={() => handleRowClick(employee.id)}>
                            <td className='assign-employees-rows'>{`${employee.firstName} ${employee.lastName}`}</td>
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
                <button className='login-button' id='assign-confirm-employees-btn' onClick={handleConfirmDeletedEmployees}>Confirm</button>
              </div>
            )}
        </div>
    );
}

export default EditDepartment;
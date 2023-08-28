import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EmployeesTable from './EmployeesTable';
import { FaArrowLeft } from 'react-icons/fa';
import TaskList from './TaskList';

const Tasks = () => {
  const { permissionLevel, loggedInId } = useParams();
  const [showEmployeesPopup, setShowEmployeesPopup] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedEmployeesData, setSelectedEmployeesData] = useState([]);
  const [loggedInManagerData, setLoggedInManagerData] = useState(null);
  const [employeesTableOpen, setEmployeesTableOpen] = useState(false);
  const [assignButtonIsOpen, setAssignButtonIsOpen] = useState(true);
  const [tasksTableDivId, setTasksTableDivId] = useState('tasks-table-div');

  useEffect(() => {
    if(permissionLevel == 1){
      fetch(`http://localhost:3001/managers/${loggedInId}`)
      .then((response) => response.json())
      .then((data) => {
        setLoggedInManagerData(data);
      })
      .catch((error) => console.log(error));
    }

    fetch(`http://localhost:3001/employees`)
        .then((response) => response.json())
        .then((data) => setAllEmployees(data))
        .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3001/tasks?accessCode=${loggedInManagerData?.accessCode}`)
        .then((response) => response.json())
        .then((data) => {
            setAllTasks(data);
            console.log('all the tasks: ', data)
        })
        .catch((error) => console.log(error));
  }, [loggedInManagerData])

  // FUNCTIONS
  const handleAddEmployees = () => {
    setShowEmployeesPopup(true);
    setAssignButtonIsOpen(false)
    setEmployeesTableOpen(false);
    setTasksTableDivId('tasks-table-div-alternative');
  };

  const handleRowClick = (employeeId) => {
    handleEmployeeSelect(employeeId);
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

  const handleConfirmEmployees = async () => {
    const selectedEmployeesData = allEmployees.filter((employee) =>
      selectedEmployees.includes(employee.id)
    );
    setSelectedEmployeesData(selectedEmployeesData);
    console.log('array of chosen employees: ', selectedEmployeesData);
    setShowEmployeesPopup(false);
    setEmployeesTableOpen(true);
    setAssignButtonIsOpen(true);
    setTasksTableDivId('tasks-table-div');
  };

  const handleCreateTask = () => {
    const taskName = document.querySelector('.create-task-name-input').value;
    const taskDescription = document.querySelector('.create-task-desc-input').value;
    const taskDeadline = document.querySelector('.create-task-date-input').value;
    
    if (!taskName.trim() || selectedEmployeesData.length < 1) {
      alert('Please fill in all fields and select at least one employee.');
      return;
    }
    
    const newTaskData = {
      name: taskName,
      description: taskDescription,
      employeesAssigned: selectedEmployeesData.map((employee) => parseInt(employee.id)),
      deadline: taskDeadline,
      creator: parseInt(loggedInId),
      accessCode: parseInt(loggedInManagerData.accessCode)
    };
  
    // Create the task on the server
    fetch('http://localhost:3001/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTaskData),
  })
  .then((response) => response.json())
  .then((createdTask) => {
    // Assign the task ID to each selected employee
    const taskId = createdTask.id;
    selectedEmployeesData.forEach((employee) => {
      if (!employee.tasksAssigned) {
        employee.tasksAssigned = [taskId];
      } else {
        employee.tasksAssigned.push(taskId);
      }
    });

    // Update the employees' data on the server
    const employeesUpdatePromises = selectedEmployeesData.map((employee) =>
      fetch(`http://localhost:3001/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      })
    );

    return Promise.all(employeesUpdatePromises);
  })
  .then(() => {
    // Handle success or any other actions after updating the employees
    console.log('Employees data updated successfully');
  })
  .catch((error) => {
    console.error('Error creating task:', error);
  });

  window.location.reload();
};

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div id='create-task-div'>
            <h1 className='create-task-title'>New Task</h1>
            <form id='create-task-form'>
                <p className='create-task-name-label'>Task Name: </p><br></br>
                <input className='create-task-name-input' type='text'></input><br></br>

                <p className='create-task-desc-label'>Description: </p><br></br>
                <textarea rows={7} className='create-task-desc-input' type='text'></textarea><br></br>

                <p className='create-task-date-label'>Deadline: </p><br />
                <input className='create-task-date-input' type='date' />
            </form>
        {showEmployeesPopup && (
              <div id='popup-add-employees' className="popup-employees-form">
                <h2 id='popup-employees-title'>Select Employees</h2>
                <div className="popup-employees-container">
                  <table className='tasks-employees-table'>
                    <tbody>
                      {allEmployees
                        .filter((employee) => employee.accessCode == loggedInManagerData.accessCode)
                        .map((employee) => (
                          <tr key={employee.id} onClick={() => handleRowClick(employee.id)}>
                            <td className='tasks-employees-rows'>{`${employee.id}`}</td>
                            <td className='tasks-employees-rows'>{`${employee.firstName} ${employee.lastName}`}</td>
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
                <button type='button' className='login-button' id='tasks-confirm-employees-btn' onClick={handleConfirmEmployees}>Confirm</button>
              </div>
            )}
            <span id="employees-table-div">
                {employeesTableOpen && <EmployeesTable employeesData={selectedEmployeesData} />}
            </span>
            {assignButtonIsOpen && (
                <button className='login-button' type='button' onClick={handleAddEmployees} id='assign-employees-button'>Assigned Employees</button>
            )}
            <div>
                <button onClick={handleCreateTask} className="login-button" id='create-task-button'>Create Task</button>
            </div>

            <div id={tasksTableDivId}>
              {allTasks.length > 0 ? (
                  <TaskList tasks={allTasks} permissionLevel={permissionLevel} borderColor="#4092f6" />
              ) : (
                  <p id='no-tasks'>No tasks created yet</p>
              )}
          </div>

            <button className="arrow-icon" onClick={handleGoBack}>
              <FaArrowLeft />
            </button>
    </div>
  );
};

export default Tasks;
import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';

const EmployeeDetails = ( {selectedEmployee, permissionLevel} ) => {
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/departments')
        .then((response) => response.json())
        .then((data) => {
            setDepartments(data);
            console.log('Fetched departments data:', data);
            console.log('permission level is: ', permissionLevel)
        })
        .catch((error) => console.log(error));

        fetch(`http://localhost:3001/tasks`)
        .then((response) => response.json())
        .then((data) => {
            console.log('Fetched tasks:', data);
            const employeeTasks = data.filter(task => task.employeesAssigned.includes(selectedEmployee.id));
            setAssignedTasks(employeeTasks);
        })
        .catch((error) => console.log(error));
    }, [selectedEmployee]);  

    return(
        <div className='employee-details-div'>
            <div className='employee-details-box'>
                <h1 className='employee-details-title'>{selectedEmployee.firstName} {selectedEmployee.lastName}</h1><br></br>
                <p id='employee-details-email' className='employee-details-label'>{selectedEmployee.email}</p><br></br>
                <p className='employee-details-label'>{selectedEmployee.title || 'No title'} - {selectedEmployee.department ? departments.find((dept) => 
                        dept.id === selectedEmployee.department)?.name : 'No Department'}
                </p><br></br>
            </div>
            
            {permissionLevel == 1 && (
                <div className="employee-tasks-div">
                    {permissionLevel == 1 && assignedTasks.length === 0 ? (
                        <div className="no-tasks-message">
                            No tasks assigned to this employee.
                        </div>
                    ) : (
                        <TaskList tasks={assignedTasks} borderColor="black" permissionLevel={permissionLevel}/>
                    )}
                </div>
            )}

            {permissionLevel != 1 && (
                <div className="employee-tasks-div">
                    {assignedTasks.length === 0 ? (
                        <div className="no-tasks-message">
                            No tasks assigned to this employee.
                        </div>
                    ) : (
                        <TaskList tasks={assignedTasks} borderColor="black" permissionLevel={permissionLevel}/>
                    )}
                </div>
            )}
        </div>
    );
}

export default EmployeeDetails;
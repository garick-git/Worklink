import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskList from "./TaskList";
import { FaArrowLeft } from "react-icons/fa";

const EmployeeTasks = () => {
    const { loggedInEmployeeId = '' } = useParams();
    const [employeeData, setEmployeeData] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [tasksIds, setTasksIds] = useState([]);

    const handleGoBack = () => {
        window.history.back();
    };

    useEffect(() => {
        fetch(`http://localhost:3001/employees/${loggedInEmployeeId}`)
        .then((response) => response.json())
        .then((data) => {
            setEmployeeData(data);
            setTasksIds(data.tasksAssigned);
        })
        .catch((error) => console.log(error));
    }, [loggedInEmployeeId]);

    useEffect(() => {
        fetch(`http://localhost:3001/tasks`)
        .then(response => response.json())
        .then(tasksData => {
            // Filter tasks based on employee's ID
            const tasksForEmployee = tasksData.filter(task => task.employeesAssigned.includes(employeeData.id));
            setMyTasks(tasksForEmployee);
            // Now tasksForEmployee contains only the tasks assigned to the logged-in employee
            console.log('Tasks for employee:', tasksForEmployee);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
    
        // if (tasksIds.length > 0) {
        //     const fetchTasksRecursively = (taskIds, currentIndex = 0, accumulatedTasks = []) => {
        //         if (currentIndex < taskIds.length) {
        //             const taskId = taskIds[currentIndex];
        //             fetch(`http://localhost:3001/tasks/${taskId}`)
        //                 .then((response) => response.json())
        //                 .then((task) => {
        //                     const updatedTasks = [...accumulatedTasks, task];
        //                     fetchTasksRecursively(taskIds, currentIndex + 1, updatedTasks);
        //                 })
        //                 .catch((error) => {
        //                     console.log(error);
        //                     fetchTasksRecursively(taskIds, currentIndex + 1, accumulatedTasks);
        //                 });
        //         } else {
        //             // All tasks fetched, update the state with accumulatedTasks
        //             setMyTasks(accumulatedTasks);
        //         }
        //     };
        //     fetchTasksRecursively(tasksIds);
        // }
    }, [tasksIds]);

    useEffect(() => {
        console.log('myTasks: ', myTasks)
    }, [myTasks])

    return (
        <div>
            {myTasks.length === 0 ? (
                <p id="no-tasks-message">No tasks assigned</p>
            ) : (
                <div className="employee-task-list">
                    <TaskList tasks={myTasks} borderColor="#4092f6" permissionLevel={2} />
                </div>
            )}

            <button className="arrow-icon" onClick={handleGoBack}>
              <FaArrowLeft />
            </button>
        </div>
    );
}

export default EmployeeTasks;

import React, { useEffect, useState } from "react";
import EmployeesTable from "./EmployeesTable";

const TaskDetails = ({ selectedTask, isManager }) => {
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [creatorFName, setCreatorFName] = useState("");
  const [creatorLName, setCreatorLName] = useState("");
  const [assignedEmployeesIDs, setAssignedEmployeesIDs] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  useEffect(() => {
    if (selectedTask) {
      // Fetch the selected task details
      fetch(`http://localhost:3001/tasks/${selectedTask.id}`)
        .then((response) => response.json())
        .then((data) => {
          setId(data.id);
          setName(data.name);
          setDescription(data.description);
          setDeadline(data.deadline);
          setAssignedEmployeesIDs(data.employeesAssigned);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedTask]);

  useEffect(() => {
    if (selectedTask) {
      // Fetch the selected task details
      fetch(`http://localhost:3001/managers/${selectedTask.creator}`)
        .then((response) => response.json())
        .then((data) => {
          setCreatorFName(data.firstName);
          setCreatorLName(data.lastName);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedTask]);

  useEffect(() => {
    if (assignedEmployeesIDs.length > 0) {
      // Fetch employees assigned to the task
      fetch(`http://localhost:3001/employees?${assignedEmployeesIDs.map((id) => `id=${id}`).join("&")}`)
        .then((response) => response.json())
        .then((employeesData) => {
          setAssignedEmployees(employeesData);
        })
        .catch((error) => console.log(error));
    } else {
      // If no assigned employees, reset the array
      setAssignedEmployees([]);
    }
  }, [assignedEmployeesIDs]);

  useEffect(() => {
    console.log('assignedEmployeesIDs: ', assignedEmployeesIDs);
  }, [assignedEmployeesIDs]);  

  useEffect(() => {
    console.log('assignedEmployees: ', assignedEmployees);
  }, [assignedEmployees]);  

  const formatReadableDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDeleteTask = () => {
    if (isManager) {
      // Delete the task from the database
      fetch(`http://localhost:3001/tasks/${selectedTask.id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Task deleted successfully");
          // Remove the deleted task ID from each assigned employee's tasksAssigned array
          assignedEmployees.forEach((employee) => {
            const updatedTasksAssigned = employee.tasksAssigned.filter(
              (taskId) => taskId !== selectedTask.id
            );
            // Update the tasksAssigned array of the employee in the database
            fetch(`http://localhost:3001/employees/${employee.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tasksAssigned: updatedTasksAssigned,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(`Updated tasksAssigned for Employee ${employee.id}`);
              })
              .catch((error) => console.log(error));
          });
          // After updating employees, refresh the assignedEmployees state
          setAssignedEmployees((prevEmployees) => {
            const updatedEmployees = prevEmployees.map((employee) => ({
              ...employee,
              tasksAssigned: employee.tasksAssigned.filter(
                (taskId) => taskId !== selectedTask.id
              ),
            }));
            return updatedEmployees;
          });
        })
        .catch((error) => console.log(error));

        window.location.reload();
    }
    else{
      alert("Only managers can delete tasks!");
      return;
    }
  };  

  return (
    <div id="task-details-div">
      <h2 id="task-details-name">#{id} - {name}</h2>
      <div>
        <p id="task-details-deadline-label">Deadline:</p>
        <p id="task-details-deadline"> {formatReadableDate(deadline)}</p>
      </div>
      <p id="task-details-label">{creatorFName} {creatorLName}: </p>
      <p id="task-details">{description}</p>
        {assignedEmployees.length > 0 && (
        <div id="task-details-employees-div">
          <EmployeesTable employeesData={assignedEmployees} lockRowClick={true}/>
        </div>
        )}
      <br></br>
      {isManager && (
        <button onClick={handleDeleteTask} type="button" id="delete-task-button" className="login-button">Delete</button>
      )}
    </div>
  );
};

export default TaskDetails;
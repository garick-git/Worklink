import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import TaskList from "./TaskList";

const EmployeeDashboard = () => {
    const { loggedInEmployeeId = '' } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [top3Tasks, setTop3Tasks] = useState([]);
    const [tasksTableIsOpen, setTasksTableIsOpen] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3001/employees/${loggedInEmployeeId}`)
          .then((response) => response.json())
          .then((data) => {
              setProfileData(data);
              console.log('Fetched employee data:', data);
          })
        .catch((error) => console.log(error));

        fetch('http://localhost:3001/departments')
          .then((response) => response.json())
          .then((data) => {
              setDepartments(data);
              console.log('Fetched departments data:', data);
          })
          .catch((error) => console.log(error));
    }, [loggedInEmployeeId]);

    useEffect(() => {
    fetch(`http://localhost:3001/employees/${loggedInEmployeeId}`)
        .then((response) => response.json())
        .then((employeeData) => {
        const assignedTasksIds = employeeData.tasksAssigned;
        fetch('http://localhost:3001/tasks')
            .then((response) => response.json())
            .then((tasksData) => {
            const assignedTasks = tasksData.filter(task => assignedTasksIds.includes(task.id));
            assignedTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            const top3 = assignedTasks.slice(0, 3);
            setTop3Tasks(top3);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    }, [loggedInEmployeeId]);

    useEffect(() => {
      console.log('employee title: ', profileData?.title);
    }, [profileData])


    const permissionLevel = 2;
    return (
        <div>
            <p className='overview-title' id="overview-employee-title">Overview</p>
            <div className='overview-table' id="overview-employee-table">
                <table>
                    <tbody>
                        <tr className="sections" id="employee-sections">
                            <td className="section">
                            <Link to={`/department/${loggedInEmployeeId}`}>
                                My Department<br></br>
                                <img className='briefcase-icon' id='employee-department-icon' src="../briefcase-icon.png" alt="Departments" />
                            </Link>
                            </td>
                            <td className="section">
                            <Link to = {`/myTasks/${loggedInEmployeeId}`}>
                                My Tasks<br></br>
                                <img className='dashboard-icon' id='notes-icon' src="../notes-icon.png" alt="Tasks" />
                            </Link>
                            </td>
                            <td className="section">
                            <Link to = {`/settings?userId=${loggedInEmployeeId}&permissionLevel=${permissionLevel}`}>
                                Edit Profile<br></br>
                                <img className='settings-icon' src='../settings-icon.png'></img>
                            </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        <div className='profile-dashboard'>
          <br></br>
          <p className='profile-title'>Profile</p>
          <table className='profile-table'>
            <tbody>
            <tr className="profile-section">
              <td>Name:</td>
              <td>{profileData?.firstName} {profileData?.lastName}</td>
            </tr>
            <tr className='profile-section'>
              <td>Email:</td>
              <td>{profileData?.email}</td>
            </tr>
            <tr className='profile-section'>
              <td>Title:</td>
              <tr>
              {!profileData ? (
                <p>Loading...</p>
              ) : (
                <td className='profile-section-title'>
                  {profileData.title ? profileData.title : 'No title'}
                </td>
              )}
            </tr>
            </tr>
            <tr className='profile-section'>
              <td>Department:</td>
              {!profileData ? (
                <p>Loading...</p>
                ) : (
                <td className='profile-section'>{profileData.department ? departments.find((dept) => 
                    dept.id === profileData.department)?.name : 'No department'}
                </td>
                )}
            </tr>
            </tbody>
          </table>
        </div>

        <div className='time-sensitive-dashboard'>
          <br></br>
          <p className='time-sensitive-title' id="time-sensitive-employee">Time Sensitive</p>
          <div id="time-sensitive-div">
          {tasksTableIsOpen ? (
            top3Tasks && top3Tasks.length > 0 ? (
              <TaskList tasks={top3Tasks} borderColor="black" />
            ) : (
              <p id="no-upcoming-tasks">No upcoming tasks</p>
            )
          ) : null}
        </div>

        </div>

        <Link className='logout-button' to = {`/`}>
          Log Out
        </Link>

        </div>
    );
}

export default EmployeeDashboard;
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import TaskList from './TaskList';

const ManagerDashboard = () => {
  const { loggedInManagerId = '' } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [top3Tasks, setTop3Tasks] = useState([]);
  const [tasksTableIsOpen, setTasksTableIsOpen] = useState(true);


  useEffect(() => {
    // Fetch profile data from the server/db.json
    fetch(`http://localhost:3001/managers/${loggedInManagerId}`)
      // Replace with the appropriate API endpoint
      .then((response) => response.json())
      .then((data) => setProfileData(data))
      .catch((error) => console.log(error));
  }, [loggedInManagerId]);

  useEffect(() => {
      fetch(`http://localhost:3001/tasks?accessCode=${profileData?.accessCode}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data: ', data);
        data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        const top3 = data.slice(0, 3);
        setTop3Tasks(top3);
      })
      .catch((error) => console.log(error));
  }, [profileData]);

  useEffect(() => {
    console.log('top 3 task: ', top3Tasks);
  }, [top3Tasks])

  const permissionLevel = 1;

  return (
    <div className="manager-dashboard">
        <p className='overview-title'>Overview</p><br></br>
        <div className='overview-table'>
        <table>
        <tbody>
        <tr className="sections">
          <td className="section">
          <Link to = {`/employees?managerId=${loggedInManagerId}&permissionLevel=${permissionLevel}`}>
            Employees<br></br>
            <img className='dashboard-icon' src="../people-icon.png" alt="Employees" />
          </Link>
          </td>
          <td className="section">
          <Link to={`/departments/${loggedInManagerId}`}>
            Departments<br></br>
            <img className='briefcase-icon' id='briefcase-icon-manager' src="../briefcase-icon.png" alt="Departments" />
          </Link>
          </td>
          <td className="section">
          <Link to = {`/tasks/1/${loggedInManagerId}`}>
            Tasks<br></br>
            <img className='dashboard-icon' id='notes-icon' src="../notes-icon.png" alt="Tasks" />
          </Link>
          </td>
          <td className="section">
          <Link to = {`/settings?userId=${loggedInManagerId}&permissionLevel=${permissionLevel}`}>
            Edit Profile<br></br>
            <img className='settings-icon' src='../settings-icon.png'></img>
          </Link>
          </td>
        </tr>
        </tbody>
        </table>
      </div>
        <br></br>

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
              <td>{profileData?.title}</td>
            </tr>
            <tr className='profile-section'>
              <td>Access Code:</td>
              <td>{profileData?.accessCode}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div className='time-sensitive-dashboard'>
          <br></br>
          <p className='time-sensitive-title'>Time Sensitive</p>
          <div id="time-sensitive-div">
          {tasksTableIsOpen ? (
            top3Tasks && top3Tasks.length > 0 ? (
              <TaskList tasks={top3Tasks} borderColor="black" permissionLevel={1}/>
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
};

export default ManagerDashboard;
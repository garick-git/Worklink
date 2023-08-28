import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Settings = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const loggedInUserId = searchParams.get('userId');
  const permissionLevel = searchParams.get('permissionLevel');
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const [inputFirstName, setInputFirstName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    title: ''
  });

    useEffect(() => {
    if (permissionLevel == 1) {
      fetch(`http://localhost:3001/managers/${loggedInUserId}`)
        .then((response) => response.json())
        .then((data) => setProfileData(data))
        .catch((error) => console.log(error));
    }

    if (permissionLevel == 2) {
      fetch(`http://localhost:3001/employees/${loggedInUserId}`)
        .then((response) => response.json())
        .then((data) => setProfileData(data))
        .catch((error) => console.log(error));
    }
  }, [loggedInUserId]);


  const handleGoBack = () => {
    window.history.back();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Create a new object with the updated form data
    const updatedUser = {
      ...profileData,
      firstName: inputFirstName || profileData.firstName,
      lastName: inputLastName || profileData.lastName,
      email: inputEmail || profileData.email,
      username: inputUsername || profileData.username,
      password: inputPassword || profileData.password,
      title: inputTitle || profileData.title
    };
  
    if(permissionLevel == 1) {
      // Perform update logic
      fetch(`http://localhost:3001/managers/${loggedInUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      })
        .then((response) => response.json())
        .then((data) => {
          // Update profileData state with the updated data
          setProfileData(data);
          console.log('sent object: ' + JSON.stringify(updatedUser));
          navigate(`/manager-dashboard/${loggedInUserId}`);
        })
        .catch((error) => console.log(error));
    }

    else if(permissionLevel == 2) {
      // Perform update logic
      fetch(`http://localhost:3001/employees/${loggedInUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      })
        .then((response) => response.json())
        .then((data) => {
          // Update profileData state with the updated data
          setProfileData(data);
          console.log('sent object: ' + JSON.stringify(updatedUser));
          navigate(`/employee-dashboard/${loggedInUserId}`);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className='settingsFormDiv'>
      {profileData && (
        <form onSubmit={handleSubmit} className='settingsForm'>
          <div className='settingsSection'>
            <label id='first-name-settings' htmlFor="firstName">First Name:</label><br></br>
            <input
              type="text"
              className='settings-input'
              id="firstName"
              name="firstName"
              placeholder={formData.firstName || profileData.firstName}
              onChange={(e) => {
                setInputFirstName(e.target.value);
                handleChange(e)}}
            />
          </div>
          <div className='settingsSection'>
            <label id='last-name-settings' htmlFor="lastName">Last Name:</label><br></br>
            <input
              type="text"
              className='settings-input'
              id="lastName"
              name="lastName"
              placeholder={formData.lastName || profileData.lastName}
              onChange={(e) => {
                setInputLastName(e.target.value);
                handleChange(e);
              }}
            />
          </div>
          <div className='settingsSection'>
            <label id='email-settings' htmlFor="email">Email:</label><br></br>
            <input
              type="email"
              className='settings-input'
              id="email"
              name="email"
              placeholder={formData.email || profileData.email}
              onChange={(e) => {
                setInputEmail(e.target.value);
                handleChange(e);
              }}
            />
          </div>
          <div className='settingsSection'>
            <label id='username-settings' htmlFor="username">Username:</label><br></br>
            <input
              type="text"
              className='settings-input'
              id="username"
              name="username"
              placeholder={formData.username || profileData.username}
              onChange={(e) => {
                setInputUsername(e.target.value);
                handleChange(e);
              }}
            />
          </div>
          <div className='settingsSection'>
            <label id='password-settings' htmlFor="password">Password:</label><br></br>
            <input
              type="password"
              className='settings-input'
              id="password"
              name="password"
              placeholder={`Current: ${formData.password || profileData.password}`}
              onChange={(e) => {
                setInputPassword(e.target.value);
                handleChange(e);
              }}
            />
          </div>
          <div className='settingsSection'>
            <label id='title-settings' htmlFor="title">Title:</label><br></br>
            <input
              type="text"
              className='settings-input'
              id="title"
              name="title"
              placeholder={formData.title || profileData.title}
              onChange={(e) => {
                setInputTitle(e.target.value);
                handleChange(e);
              }}
            />
          </div>
          <button type="submit">Save</button>
        </form>
      )}
      <button  className="arrow-icon" onClick={handleGoBack}>
        <FaArrowLeft />
      </button>
    </div>
  );
};

export default Settings;
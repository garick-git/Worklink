import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeSignup from './EmployeeSignUp';

const EmployeeLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3001/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees from the server');
      }
  
      const employees = await response.json();
      console.log('Fetched employees:', employees);

      const matchedEmployee = employees.find(
        (employee) => employee.username === username && employee.password === password
      );
  
      if (matchedEmployee) {
        console.log('Login successful! Employee:', matchedEmployee);
        navigate(`/employee-dashboard/${matchedEmployee.id}`);
      } else {
        console.log('Invalid login credentials');
        alert('User not found!');
      }
    } catch (error) {
      console.log('Error occurred during login:', error);
    }
  };  

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <form className="manager-login">
        <center>
          <div className='username-section'>
            <label id='username-lbl' htmlFor="username">Username:</label><br />
            <input
              type="text"
              id="username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div><br />
          <div className='password-section'>
            <label id='password-lbl' htmlFor="password">Password:</label><br />
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={handleTogglePassword}
                id='eye-icon'
              />
            </div>
          </div><br />
          <button className="login-button" type="submit" onClick={handleSubmit}>Log in</button>
          <br />
          <label id='no-account-label'>Don't have an account?</label>
          <Link to = {`/employee-signup`}>
            Sign up<br></br>
          </Link>
          <br />
          <button className="home-icon" type='button' onClick={handleGoBack}>
            <FontAwesomeIcon icon={faHome} />
          </button>
        </center>
      </form>
    </div>
  );
};

export default EmployeeLogin;
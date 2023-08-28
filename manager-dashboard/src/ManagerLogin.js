import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const ManagerLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Fetch the user data from the database
    fetch('http://localhost:3001/managers')
      .then((response) => response.json())
      .then((data) => {
        // Check if the entered username and password match any user in the database
        const foundUser = data.find(
          (user) => user.username === username && user.password === password
        );
  
        if (foundUser) {
          const loggedInManagerId = foundUser.id;
          navigate(`/manager-dashboard/${loggedInManagerId}`);
        } else {
          // Invalid username or password, show login error
          setLoginError(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };  

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <form className="manager-login" onSubmit={handleSubmit}>
        <center>
          <div className="username-section">
            <label id="username-lbl" htmlFor="username">
              Username:
            </label>
            <br />
            <input
              type="text"
              id="username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <br />
          <div className="password-section">
            <label id="password-lbl" htmlFor="password">
              Password:
            </label>
            <br />
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
                id="eye-icon"
              />
            </div>
          </div>
          <br />
          {loginError && <p className="login-error">Invalid username or password</p>}
          <button className="login-button" type="submit">
            Log in
          </button>
          <br />
          <label id="no-account-label">Don't have an account?</label>
          <Link to="/manager-signup">
            <label id="sign-up-link">Sign up</label>
          </Link>
          <br />
          <button className="home-icon" onClick={handleGoBack}>
            <FontAwesomeIcon icon={faHome} />
          </button>
        </center>
      </form>
    </div>
  );
};

export default ManagerLogin;
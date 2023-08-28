import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const ManagerSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [accessCode, setAccessCode] = useState(null);
  const [signupError, setSignupError] = useState('');
  const permissions = 1;
  const navigate = useNavigate();
  const [allAccessCodes, setAllAccessCodes] = useState([]);
  const [lastManagerID, setLastManagerID] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // Fetch access codes from the server
    fetch('http://localhost:3001/access-codes')
      .then(response => response.json())
      .then(data => {
        setAllAccessCodes(data); // Update the state with the fetched access codes
      })
      .catch(error => {
        console.error('Error fetching access codes:', error);
      });
  }, [])

  useEffect(() => {
    fetch('http://localhost:3001/managers?_sort=id&_order=desc&_limit=1')
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const latestManager = data[0];
          setLastManagerID(latestManager.id);
        }
      })
      .catch(error => {
        console.error('Error fetching latest manager:', error);
      });
  }, []);

  useEffect(() => {
    console.log('lastManagerID is: ', lastManagerID)
  }, [lastManagerID])

  const generateAccessCode = () => {
    const generateUniqueAccessCode = async () => {
      let existingAccessCodes = []; // Initialize as an empty array

      try {
        // Fetch existing access codes
        existingAccessCodes = await fetch('http://localhost:3001/access-codes')
          .then((response) => response.json())
          .catch((error) => {
            console.log(error);
            return [];
          });

        // Generate a unique access code
        while (true) {
          const code = Math.floor(100000 + Math.random() * 900000);
          if (!existingAccessCodes.includes(code)) {
            return code;
          }
        }
      } catch (error) {
        console.log('Error fetching existing access codes:', error);
      }
    };

    generateUniqueAccessCode()
      .then((code) => {
        setAccessCode(parseInt(code));
      })
      .catch((error) => {
        console.log('Error generating unique access code:', error);
      });
  };

  const handleNewAccessCode = () => {
    generateAccessCode();
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if any input fields are empty
    if (!firstName || !lastName || !email || !username || !password || !accessCode) {
      setSignupError('Please fill in all the fields.');
      return;
    }

    if (username.includes(' ')) {
      setSignupError("Username/password can't have any spaces");
      return;
    }
  
    // Check if the email is in a valid format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setSignupError('Invalid email format.');
      return;
    }

    // Check if the access code is within the specified range
    if (accessCode < 100000 || accessCode > 999999) {
      setSignupError('Access code must be between 100000 and 999999.');
      return;
    }

    // Check if the access code is already in the allAccessCodes array
    if (allAccessCodes.includes(accessCode)) {
      setSignupError('Access code is already in use.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3001/managers');
      const data = await response.json();
  
      const existingUser = data.find((user) => user.email === email || user.username === username);
      if (existingUser) {
        setSignupError('Email or username is already in use.');
      } else {
        const newUser = { firstName, lastName, email, username, password, title, accessCode, permissions };
  
      fetch('http://localhost:3001/managers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
      });
        
      const newAccessCode = { code: accessCode }; // New access code to add
      fetch('http://localhost:3001/access-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAccessCode),
      })
        .then(response => response.json())
        .then(data => {
          console.log('New access code added:', data);
        })
        .catch(error => {
          console.error('Error adding access code:', error);
        });       
        
        const loggedInManagerId = lastManagerID + 1; // Adjust this based on your data structure
        navigate(`/manager-dashboard/${loggedInManagerId}`);
        console.log('manager id: ', loggedInManagerId)
      }
    } catch (error) {
      console.log(error);
      setSignupError('Error occurred while signing up. Please try again later.');
    }
  };  

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="signup-container">
      <form className="manager-signup" onSubmit={handleSubmit}>
        <center>
          {signupError && <p className="signup-error">{signupError}</p>}
          <div>
            <div className="input-group">
              <label htmlFor="fname-input-signup">First Name</label>
              <br />
              <input
                type="text"
                id="fname-input-signup"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <br />
            <div className="input-group">
              <label htmlFor="lname-input-signup">Last Name</label>
              <br />
              <input
                type="text"
                id="lname-input-signup"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <br />
          <div className="input-group">
            <label htmlFor="email-input-signup">Email</label>
            <br />
            <input
              type="email"
              id="email-input-signup"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <br />
          <div className="input-group">
            <label htmlFor="username-input-signup">Username</label>
            <br />
            <input
              type="text"
              id="username-input-signup"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <br />
          <div className="input-group">
            <label htmlFor="password-input-signup">Password</label>
            <br />
            <div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password-input-signup"
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
          <div className="input-group">
        <label htmlFor="accessCode-input-signup">Access Code</label>
        <div>
          <input
            id="accessCode-input-signup"
            value={accessCode}
            onChange={(e) => setAccessCode(parseInt(e.target.value))}
          />
          <div
            className="info-button"
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
          >
            ⓘ
          </div>
        </div>
      </div>
          {showInfo && (
            <div className="info-text">
              The access code is your unique "work environment" code. You will share it with your co-workers (managers/employees). If you weren't given one, click 'New Access Code.'
            </div>
          )}
          <br></br>
          <button type='button' onClick={handleNewAccessCode} title='Click if you need a new access code' className='login-button' id='new-accessCode-button'>
            New Access Code
          </button>
          <button onClic={handleSubmit} className="login-button" id='signup-button'type="submit">
            Sign up
          </button>
          <br />
          <label id="no-account-label">Already have an account?</label>
          <Link to="/manager-login">
            <label id="sign-up-link">Log in</label>
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

export default ManagerSignup;
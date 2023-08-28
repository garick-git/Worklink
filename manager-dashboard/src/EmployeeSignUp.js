import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const EmployeeSignup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState(null);
    const [title, setTitle] = useState('');
    const [accessCode, setAccessCode] = useState(null);
    const [signupError, setSignupError] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const permissions = 1;
    const navigate = useNavigate();

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
    
        // Check if the email is in a valid format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setSignupError('Invalid email format.');
            return;
        }
    
        try {
            // Fetch existing users data
            const employeesResponse = await fetch('http://localhost:3001/employees');
            const employeesData = await employeesResponse.json();
    
            // Check if the username is already in use
            const usernameExists = employeesData.some(user => user.username === username);
            if (usernameExists) {
                setSignupError('Username is already in use.');
                return;
            }
    
            // Check if the access code exists in the database
            console.log('accessCode you input: ', accessCode);
            const accessCodeResponse = await fetch(`http://localhost:3001/access-codes?code=${accessCode}`);

            if (!accessCodeResponse.ok) {
                setSignupError('Invalid access code.');
                return;
            }

            const accessCodeData = await accessCodeResponse.json();

            // Check if the access code exists in the access-codes database
            const accessCodeExists = accessCodeData.some(codeObj => codeObj.code === accessCode);

            if (!accessCodeExists) {
                setSignupError('Access code not found. Please get one from your manager.');
                return;
            }

            else{
                const matchingAccessCode = accessCodeData.find(codeObj => codeObj.code === accessCode);
                console.log('access code found in the database. It belongs to environment with ID = ', matchingAccessCode)
            }
    
            // Proceed with sign-up process
            const newUser = {
                firstName,
                lastName,
                email,
                username,
                password,
                department,
                title,
                accessCode,
                permissions,
            };
    
            // Create a new employee in the database
            const createEmployeeResponse = await fetch('http://localhost:3001/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
    
            if (createEmployeeResponse.ok) {
                // Fetch the created employee's data to get the ID
                const newEmployeeResponse = await fetch(`http://localhost:3001/employees?username=${username}`);
                const newEmployeeData = await newEmployeeResponse.json();
    
                if (newEmployeeData.length > 0) {
                    const loggedInEmployeeId = newEmployeeData[0].id;
                    navigate(`/employee-dashboard/${loggedInEmployeeId}`);
                }
            } else {
                setSignupError('Error occurred while signing up. Please try again later.');
            }
        } catch (error) {
            console.log(error);
            setSignupError('Error occurred. Please try again later.');
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
            </div><br />
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
              The access code is your unique "work environment" code. If you didn't receive one, contact your manager.
            </div>
          )}
            <br></br>
            <button onClic={handleSubmit} className="login-button" id='signup-button'type="submit">
                Sign up
            </button>
            <br />
            <label id="no-account-label">Already have an account?</label>
            <Link to="/employee-login">
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
}

export default EmployeeSignup
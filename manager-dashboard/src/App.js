import React from 'react';
import Home from './Home';
import Navbar from './Navbar';
import ManagerLogin from './ManagerLogin';
import ManagerSignup from './ManagerSignup';
import EmployeeLogin from './EmployeeLogin';
import ManagerDashboard from './ManagerDashboard';
import Settings from './Settings';
import Departments from './Departments';
import Employees from './Employees';
import Tasks from './Tasks';
import EmployeeDashboard from './EmployeeDashboard';
import EmployeeDepartment from './EmployeeDepartment';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import EmployeeTasks from './EmployeeTasks';
import EmployeeSignup from './EmployeeSignUp';

const App = () => {
  return (
    <Router>
      <div>
        <NavbarContent />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manager-login" element={<ManagerLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/manager-signup" element={<ManagerSignup />} />
          <Route path="/employee-signup" element={<EmployeeSignup />} />
          <Route path="/manager-dashboard/:loggedInManagerId" element={<ManagerDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path ="/settings/:userId/:permissionLevel" element={<Settings/>}/>
          <Route path="/departments/:loggedInManagerId" element = {<Departments/>}/>
          <Route path="/department/:loggedInEmployeeId" element = {<EmployeeDepartment/>}/>
          <Route path="/employees" element={<Employees />} />
          <Route path="/tasks/:permissionLevel/:loggedInId" element={<Tasks/>}/>
          <Route path="myTasks/:loggedInEmployeeId" element = {<EmployeeTasks/>}/>
          <Route path = "/employee-dashboard/:loggedInEmployeeId" element= {<EmployeeDashboard/>}/>
        </Routes>
      </div>
    </Router>
  );
};

const NavbarContent = () => {
  const location = useLocation();

  return (
    <Navbar pageTitle={getPageTitle(location.pathname)} />
  );
};

const getPageTitle = (pathname) => {
  if (pathname === '/manager-login') {
    return 'Manager Login';
  } 
  if (pathname === '/employee-login'){
    return 'Employee Login';
  }
  if (pathname === '/manager-signup'){
    return 'Manager Sign up';
  }
  if (pathname === '/employee-signup'){
    return 'Employee Sign up';
  }
  if (pathname.startsWith('/manager-dashboard')){
    return 'Manager Dashboard';
  }
  if (pathname.startsWith('/settings')){
    return 'Settings'
  }
  if (pathname.startsWith('/tasks')){
    return 'Tasks'
  }
  if (pathname.startsWith('/myTasks')){
    return 'My Tasks'
  }
  if (pathname.startsWith('/departments')){
    return 'Departments'
  }
  if (pathname.startsWith('/department')){
    return 'Department'
  }
  if (pathname.startsWith('/employees')){
    return 'Employees'
  }
  if (pathname.startsWith('/employee-dashboard')){
    return 'Employee Dashboard'
  }
  if (pathname === '/'){
    return 'Welcome'
  }
  else {
    return 'Page not existing...';
  }
};

export default App;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';
import EmployeeDetails from "./EmployeeDetails";
import { FaTimes } from "react-icons/fa";

const EmployeeDepartment = () => {
    const { loggedInEmployeeId = '' } = useParams();
    const [employeesData, setEmployeesData] = useState([]);
    const [loggedInEmployeeData, setLoggedInEmployeeData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [employeeDetailsOpen, setEmployeeDetailsOpen] = useState(false);

    const handleCloseForm = () => {
        setEmployeeDetailsOpen(false);
    }

    const handleGoBack = () => {
        window.history.back();
    }

    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
        setEmployeeDetailsOpen(true);
    }

    useEffect(() => {
        fetch('http://localhost:3001/employees')
        .then((response) => response.json())
        .then((data) => {
            setEmployeesData(data);
            console.log('Fetched employees data:', data);
        })
        .catch((error) => console.log(error));

        fetch(`http://localhost:3001/employees/${loggedInEmployeeId}`)
        .then((response) => response.json())
        .then((data) => {
            setLoggedInEmployeeData(data);
            console.log('Fetched employees data:', data);
        })
        .catch((error) => console.log(error));
        
        fetch('http://localhost:3001/departments')
        .then((response) => response.json())
        .then((data) => {
            setDepartments(data);
            console.log('Fetched departments data:', data);
        })
        .catch((error) => console.log(error));
        
        // Fetch managers from the server/db.json (Replace with the appropriate endpoint)
        fetch(`http://localhost:3001/managers/${loggedInEmployeeId}`)
        .then((response) => response.json())
        .then((data) => {
            console.log('Fetched manager data:', data);
        })
        .catch((error) => console.log(error));
    }, [loggedInEmployeeId]); 

    useEffect(() => {
      console.log('Selected Employee:', selectedEmployee);
    }, [selectedEmployee]);

    // Filter employees based on the department of the logged-in employee
    const filteredEmployees = employeesData.filter(
        (employee) => employee.department === loggedInEmployeeData?.department
    );

    useEffect(() => {
        console.log('Employees Data: ', employeesData, 'Filtered Employees: ', filteredEmployees);
    }, [filteredEmployees]);

    return (
        <div>
            {loggedInEmployeeData.department >= 1 ? (
            <div id="employees-div">
                <table className='employees-table'>
                <thead>
                <tr className='table-headers'>
                    <th className='tasks-column-lbl'>ID#</th>
                    <th className='tasks-column-lbl'>Name</th>
                    <th className='tasks-column-lbl'>Department</th>
                    <th className='tasks-column-lbl'>Title</th>
                </tr>
                </thead>
                <br></br>
                <tbody>
                {filteredEmployees.map((employee) => (
                    <tr className='rows' key={employee.id} onClick={() => handleRowClick(employee)}>
                        <td id='employees-id-column'>{employee.id}</td>
                        <td id='employees-name-column'>{`${employee.firstName} ${employee.lastName}`}</td>
                        <td id='employees-department-column'>
                            {employee.department ? departments.find((dept) => dept.id === employee.department)?.name : 'No Department'}
                        </td>                    
                        <td id="employees-title-column">{employee.title}</td>
                    </tr>
                ))}
                </tbody>
                </table>
            </div>
            ):<p id="no-department">No Department</p>}
            {employeeDetailsOpen && (
            <div className="employee-details-for-employee">    
                <EmployeeDetails selectedEmployee={selectedEmployee}/>
            </div>   
            )}
            {employeeDetailsOpen && (
                <p className="close-icon" id='close-employee-details-department' onClick={handleCloseForm}>
                    <FaTimes />
                </p>
            )}
            <button className="arrow-icon" onClick={handleGoBack}>
                <FaArrowLeft />
            </button>
        </div>
    );
}

export default EmployeeDepartment;
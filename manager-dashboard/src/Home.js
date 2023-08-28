import { Link } from 'react-router-dom';

const Home = () => {
    return (
      <div className="home-dashboard">
        <div className="button-container">
            <Link to={`/manager-login`}>
                <button className="go-to-manager-dash">I am a Manager</button>
            </Link>

            <Link to = {`/employee-login`}>
              <button className="go-to-employee-dash">I am an Employee</button>
            </Link>
        </div>
      </div>
    );
  };
  
  export default Home;
  
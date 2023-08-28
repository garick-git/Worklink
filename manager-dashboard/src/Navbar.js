const Navbar = ({ pageTitle }) => {
    return (
      <div className="header-div">
        <h1 className="title">{pageTitle}</h1>
        <img className="logo" src="/worklink-logo-MAIN.png" alt="workLinkLogo"/>
      </div>
    );
  };

export default Navbar;
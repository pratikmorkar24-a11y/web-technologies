import { Link } from "react-router-dom";
import vitLogo from "../assets/vit-logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">

        <Link to="/" className="logo">
          <img
            src={vitLogo}
            alt="VIT Logo"
            className="navbar-logo"
          />

          <span>VIT Result Portal</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Login</Link>
          <Link to="/add-user">Add User</Link>
          <Link to="/add-marks">Add Marks</Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
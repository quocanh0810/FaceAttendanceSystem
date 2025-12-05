// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">
          <span className="icon">F</span>
          <span>Face Attendance System</span>
        </div>
        <nav className="nav-links">
          <NavLink
            to="/students"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link--active" : "")
            }
          >
            Students
          </NavLink>
          <NavLink
            to="/classes"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link--active" : "")
            }
          >
            Classes
          </NavLink>
          <NavLink
            to="/sessions"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link--active" : "")
            }
          >
            Sessions
          </NavLink>
          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link--active" : "")
            }
          >
            Attendance
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
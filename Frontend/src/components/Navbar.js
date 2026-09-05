import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar(props) {
  const logoUrl =
    "https://www.tomorrowisbetter.org/assets/Tomorrow%20is%20better%20logo-CBq5aH4y.jpg";
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <NavLink className="brand" to="/">
          <img src={logoUrl} alt="Tomorrow is Better" className="brand-logo" />
          <span>{props.title}</span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/products">Inventory</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink className="nav-cta" to="/insertproduct">
            Add resource <span>+</span>
          </NavLink>
          <button className="logout-button" onClick={props.onLogout}>
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}

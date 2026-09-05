import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoUrl =
    "https://www.tomorrowisbetter.org/assets/Tomorrow%20is%20better%20logo-CBq5aH4y.jpg";
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <NavLink className="brand" to="/" onClick={closeMenu}>
          <img src={logoUrl} alt="Tomorrow is Better" className="brand-logo" />
          <span>{props.title}</span>
        </NavLink>
        <button
          className="menu-toggle"
          type="button"
          aria-controls="main-navigation-links"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
          <span className="menu-toggle-label">Menu</span>
        </button>
        <div
          className={`nav-links${menuOpen ? " nav-links-open" : ""}`}
          id="main-navigation-links"
        >
          <NavLink className="nav-dashboard" to="/" onClick={closeMenu}>
            Dashboard
          </NavLink>
          <NavLink className="nav-inventory" to="/products" onClick={closeMenu}>
            Inventory
          </NavLink>
          <NavLink className="nav-profile" to="/profile" onClick={closeMenu}>
            Profile
          </NavLink>
          <NavLink className="nav-cta" to="/insertproduct" onClick={closeMenu}>
            Add resource <span>+</span>
          </NavLink>
          <button
            className="logout-button"
            onClick={() => {
              closeMenu();
              props.onLogout();
            }}
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Web Stories CMS
        </Link>
        <div className="navbar-nav">
          <Link to="/" className="nav-link">
            Dashboard
          </Link>
          <Link to="/add-story" className="nav-link">
            Add Story
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
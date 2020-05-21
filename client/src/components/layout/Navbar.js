import React, {Fragment} from 'react';
import {Link, NavLink} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {logout} from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  
  const authLinks = (
    <ul>
      <li>
        <a href="#!" onClick={logout}>
          <i className="fa fa-sign-out-alt"></i> Logout
        </a>
      </li>
    </ul>
  );
  
  const guestLinks = (
    <ul>
      <li><NavLink to="/">Developers</NavLink></li>
      <li><NavLink to="/register">Register</NavLink></li>
      <li><NavLink to="/login">Login</NavLink></li>
    </ul>
  );
  
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
      </h1>
      {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
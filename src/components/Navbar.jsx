import React from "react";
import { Link, NavLink, withRouter } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        Pokedex
      </Link>
      <div className="d-flex">
        <NavLink className="btn btn-dark mr-2" to="/" exact>
          Login
        </NavLink>
      </div>
    </div>
  );
};

export default withRouter(Navbar);

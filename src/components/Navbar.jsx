import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, withRouter } from "react-router-dom";
import { userLogOut } from "../store/user";

const Navbar = (props) => {
  const dispatch = useDispatch();
  const active = useSelector((store) => store.entities.user.active);

  const logout = () => {
    dispatch(userLogOut());
    props.history.push("/login");
  };

  return (
    <div className="navbar navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        Pokedex
      </Link>
      <div className="d-flex">
        {active ? (
          <>
            <NavLink className="btn btn-dark mr-2" to="/" exact>
              Home
            </NavLink>

            <NavLink className="btn btn-dark mr-2" to="/perfil" exact>
              Profile
            </NavLink>

            <button className="btn btn-dark mr-2" onClick={() => logout()}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default withRouter(Navbar);

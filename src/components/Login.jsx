import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogIn } from "../store/user";
import { withRouter } from "react-router-dom";

const Login = (props) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.entities.user.loading);
  const active = useSelector((state) => state.entities.user.active);

  React.useEffect(() => {
    if (active) props.history.push("/");
  }, [active, props.history]);

  return (
    <div className="mt-5 text-center">
      <h3>Sign In with Google</h3>
      <hr />
      <button
        className="btn btn-primary"
        onClick={() => dispatch(userLogIn())}
        disabled={loading}
      >
        Login
      </button>
    </div>
  );
};

export default withRouter(Login);

import React, { useEffect } from "react";
import Navbar from "./components/Navbar";

import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { userLogIn, userLogOut } from "./store/user";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    //eslint-disable-next-line
  }, []);

  return (
    <Router>
      <div className="container mt-3">
        <Navbar />
        <button onClick={() => dispatch(userLogIn())}>goggle login</button>
        <button onClick={() => dispatch(userLogOut())}>logout</button>
      </div>
    </Router>
  );
}

export default App;

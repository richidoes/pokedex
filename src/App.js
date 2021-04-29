import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import Pokemons from "./components/Pokemons";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { auth } from "./firebase";
import Profile from "./components/Profile";
import { readActiveUser } from "./store/user";

function App() {
  const [firebaseUser, setFirebaseUser] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(readActiveUser());

    auth.onAuthStateChanged((user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
      }
    });
    //eslint-disable-next-line
  }, []);

  const RutaPrivada = ({ component, path, ...rest }) => {
    if (localStorage.getItem("user")) {
      const usuarioStorage = JSON.parse(localStorage.getItem("user"));
      if (usuarioStorage.uid === firebaseUser.uid) {
        return <Route component={component} path={path} {...rest} />;
      }
      return <Redirect to="/login" {...rest} />;
    }
    return <Redirect to="/login" {...rest} />;
  };

  return firebaseUser !== false ? (
    <Router>
      <div className="container mt-3">
        <Navbar />
        <Switch>
          <RutaPrivada component={Pokemons} path="/" exact />
          <RutaPrivada component={Profile} path="/perfil" exact />
          <Route component={Login} path="/login" exact />
        </Switch>
      </div>
    </Router>
  ) : (
    <div>Loading...</div>
  );
}

export default App;

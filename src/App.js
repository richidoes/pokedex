import React, { useEffect } from "react";
import Navbar from "./components/Navbar";

import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadPokemons } from "./store/pokemons";

function App() {
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.entities.pokemons.data.results);

  console.log(pokemons);

  useEffect(() => {
    dispatch(loadPokemons());
    //eslint-disable-next-line
  }, []);

  return (
    <Router>
      <div className="container mt-3">
        <Navbar />
      </div>
    </Router>
  );
}

export default App;

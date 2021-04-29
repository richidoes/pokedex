import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  loadDefaultPokemons,
  loadNextPokemons,
  loadPreviousPokemons,
  getPokemonDetails,
} from "../store/pokemons";
import Details from "./Details";

const Pokemons = () => {
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.entities.pokemons.list);
  const pokemonsList = pokemons.results;
  const next = pokemons.next;
  const previous = pokemons.previous;

  useEffect(() => {
    if (Object.keys(pokemons).length === 0) {
      dispatch(loadDefaultPokemons());
    }
    //eslint-disable-next-line
  }, []);

  return (
    <div className="row mt-3">
      <div className="col-md-6">
        <h3 className="text-center">List of pokemons</h3>
        <ul className="list-group mt-3">
          {pokemonsList &&
            pokemonsList.map((pokemon, index) => (
              <li className="list-group-item" key={index}>
                {pokemon.name}
                <button
                  className="btn btn-info btn-sm float-right"
                  onClick={() => dispatch(getPokemonDetails(pokemon.url))}
                >
                  Info
                </button>
              </li>
            ))}
        </ul>

        <div className="d-flex justify-content-between mt-3">
          {pokemonsList?.length === 0 && (
            <button
              className="btn btn-primary"
              onClick={() => dispatch(loadDefaultPokemons())}
            >
              Get pokemons
            </button>
          )}
          {previous && (
            <button
              className="btn btn-warning"
              onClick={() => dispatch(loadPreviousPokemons())}
            >
              Previous
            </button>
          )}
          {next && (
            <button
              className="btn btn-success"
              onClick={() => dispatch(loadNextPokemons())}
            >
              Next
            </button>
          )}
        </div>
      </div>

      <div className="col-md-6">
        <h3 className="text-center">Pokemon details</h3>
        <Details />
      </div>
    </div>
  );
};

export default Pokemons;

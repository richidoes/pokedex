import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPokemonDetails } from "../store/pokemons";

const Details = () => {
  const dispatch = useDispatch();
  const pokemon = useSelector((state) => state.entities.pokemons.pokemon);
  const pokemonImage = pokemon?.sprites?.other?.dream_world?.front_default;
  const pokemonName = pokemon?.name;
  const pokemontypes = pokemon?.types;
  const pokemonHeight = pokemon?.height;
  const pokemonWeight = pokemon?.weight;

  useEffect(() => {
    if (Object.keys(pokemon).length === 0) dispatch(getPokemonDetails());

    //eslint-disable-next-line
  }, []);

  return pokemon ? (
    <article className="card text-dark text-center mb-3 mt-3 bg-light">
      <div className="card-header"> </div>
      <div className="card-body">
        <img src={pokemonImage} className="img-fluid" alt={pokemonName} />

        <h4 className="card-title text-uppercase mt-3">{pokemonName}</h4>
        <div className="flex-evenly">
          {pokemontypes &&
            pokemontypes.map((types, index) => (
              <h5 key={index}>{types.type.name}</h5>
            ))}
        </div>
        <p className="card-text mt-3 text-muted">
          Height: {pokemonHeight / 10} m | Weight: {pokemonWeight / 10} kg
        </p>
      </div>
    </article>
  ) : null;
};

export default Details;

import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import { baseURL, defaultPokemonURL } from "../config";

//----------reducer -----------------
const slice = createSlice({
  name: "pokemons",
  initialState: {
    loading: false,
    pokemon: {},
    list: {},
  },
  reducers: {
    //actions => action handlers
    pokemonDetailsReceived: (pokemons, action) => {
      pokemons.pokemon = action.payload;
      pokemons.loading = false;
    },

    pokemonsRequested: (pokemons, action) => {
      pokemons.loading = true;
    },

    pokemonsReceived: (pokemons, action) => {
      pokemons.list = action.payload;
      pokemons.loading = false;
    },

    pokemonsRequestFailed: (pokemons, action) => {
      pokemons.loading = false;
    },
  },
});

export const {
  pokemonsRequested,
  pokemonsReceived,
  pokemonsRequestFailed,
  pokemonDetailsReceived,
} = slice.actions;
export default slice.reducer;

//--------actions -------------------

//get single pokemon details
export const getPokemonDetails = (pokemonURL = defaultPokemonURL) => (
  dispatch
) => {
  if (localStorage.getItem(pokemonURL)) {
    const pokemonDetails = JSON.parse(localStorage.getItem(pokemonURL));

    return dispatch(pokemonDetailsReceived(pokemonDetails));
  }

  return dispatch(
    apiCallBegan({
      url: pokemonURL,
      onStart: pokemonsRequested.type,
      onSuccess: pokemonDetailsReceived.type,
      onError: pokemonsRequestFailed.type,
    })
  );
};
//get the firsts pokemons
export const loadDefaultPokemons = () => (dispatch) => {
  if (localStorage.getItem(baseURL)) {
    const pokemons = JSON.parse(localStorage.getItem(baseURL));

    return dispatch(pokemonsReceived(pokemons));
  } else {
    return dispatch(
      apiCallBegan({
        url: baseURL,
        onStart: pokemonsRequested.type,
        onSuccess: pokemonsReceived.type,
        onError: pokemonsRequestFailed.type,
      })
    );
  }
};

//get the next page of pokemons
export const loadNextPokemons = () => (dispatch, getState) => {
  const { next } = getState().entities.pokemons.list;

  if (localStorage.getItem(next)) {
    const nextPokemons = JSON.parse(localStorage.getItem(next));

    return dispatch(pokemonsReceived(nextPokemons));
  } else {
    return dispatch(
      apiCallBegan({
        url: next,
        onStart: pokemonsRequested.type,
        onSuccess: pokemonsReceived.type,
        onError: pokemonsRequestFailed.type,
      })
    );
  }
};

//get the previous page of pokemons
export const loadPreviousPokemons = () => (dispatch, getState) => {
  const { previous } = getState().entities.pokemons.list;

  if (localStorage.getItem(previous)) {
    const previousPokemons = JSON.parse(localStorage.getItem(previous));

    return dispatch(pokemonsReceived(previousPokemons));
  } else {
    return dispatch(
      apiCallBegan({
        url: previous,
        onStart: pokemonsRequested.type,
        onSuccess: pokemonsReceived.type,
        onError: pokemonsRequestFailed.type,
      })
    );
  }
};

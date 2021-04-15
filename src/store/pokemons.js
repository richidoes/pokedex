import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import { baseURL } from "../config";

//-------- constants -------------
const dataInicial = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

//--------- types --------------------
const OBTENER_POKEMONES_EXITO = "OBTENER_POKEMONES_EXITO";
const SIGUIENTE_POKEMONES_EXITO = "SIGUIENTE_POKEMONES_EXITO";
const POKE_INFO_EXITO = "POKE_INFO_EXITO";

//----------reducer -----------------
// export default function pokeReducer(state = dataInicial, action) {
//   switch (action.type) {
//     case OBTENER_POKEMONES_EXITO:
//       return { ...state, ...action.payload };
//     case SIGUIENTE_POKEMONES_EXITO:
//       return { ...state, ...action.payload };
//     case POKE_INFO_EXITO:
//       return { ...state, unPokemon: action.payload };
//     default:
//       return state;
//   }
// }

const slice = createSlice({
  name: "pokemons",
  initialState: {
    loading: false,
    data: {},
  },
  reducers: {
    //actions => action handlers
    pokemonsRequested: (pokemons, action) => {
      pokemons.loading = true;
    },

    pokemonsReceived: (pokemons, action) => {
      pokemons.data = action.payload;
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
} = slice.actions;
export default slice.reducer;

//--------actions -------------------

export const pokeDetalleAccion = (
  url = "https://pokeapi.co/api/v2/pokemon/1/"
) => async (dispatch) => {
  //prevent request api if has the data saved in localStorage
  if (localStorage.getItem(url)) {
    dispatch({
      type: POKE_INFO_EXITO,
      payload: JSON.parse(localStorage.getItem(url)),
    });
    return;
  }

  try {
    const res = await axios.get(url);

    dispatch({
      type: POKE_INFO_EXITO,
      payload: {
        nombre: res.data.name,
        peso: res.data.weight,
        alto: res.data.height,
        foto: res.data.sprites.front_default,
      },
    });
    //save data if first time getting data
    localStorage.setItem(
      url,
      JSON.stringify({
        nombre: res.data.name,
        peso: res.data.weight,
        alto: res.data.height,
        foto: res.data.sprites.front_default,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

//get the firsts pokemons
export const loadPokemons = () => (dispatch) => {
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
export const siguientePokemonAction = () => async (dispatch, getState) => {
  const { next } = getState().pokemones; //has the url to next page

  //prevent request api if has the data saved in localStorage
  if (localStorage.getItem(next)) {
    dispatch({
      type: SIGUIENTE_POKEMONES_EXITO,
      payload: JSON.parse(localStorage.getItem(next)),
    });
    return;
  }

  try {
    const res = await axios.get(next);

    dispatch({
      type: SIGUIENTE_POKEMONES_EXITO,
      payload: res.data,
    });
    //save data if first time getting data
    localStorage.setItem(next, JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
  }
};

//get the previous page of pokemons
/* In this case, the only thing that changes is the URL to use, but all the data
that we receive are still the same, but from another source, that's why
we reuse "type" and replace just the url */
export const anteriorPokemonAccion = () => async (dispatch, getState) => {
  const { previous } = getState().pokemones; //has the url to previous page

  //prevent request api if has the data saved in localStorage
  if (localStorage.getItem(previous)) {
    dispatch({
      type: SIGUIENTE_POKEMONES_EXITO,
      payload: JSON.parse(localStorage.getItem(previous)),
    });
    return;
  }

  try {
    const res = await axios.get(previous);

    dispatch({
      type: SIGUIENTE_POKEMONES_EXITO,
      payload: res.data,
    });
    //save data if first time getting data
    localStorage.setItem(previous, JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
  }
};

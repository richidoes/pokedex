import { combineReducers } from "redux";
import pokemonsReducer from "./pokemons";
import authReducer from "./auth";

export default combineReducers({
  pokemons: pokemonsReducer,
  user: authReducer,
});

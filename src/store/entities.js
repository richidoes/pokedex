import { combineReducers } from "redux";
import pokemonsReducer from "./pokemons";
import userReducer from "./user";

export default combineReducers({
  pokemons: pokemonsReducer,
  user: userReducer,
});

import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
import api from "./middleware/api";
import auth from "./middleware/auth";

export default function store() {
  return configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), api, auth],
  });
}

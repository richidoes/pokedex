import { createSlice } from "@reduxjs/toolkit";
import { authBegan } from "./auth";

//---------- Reducer ----------------
const slice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    active: false,
    data: {},
  },
  reducers: {
    //actions => action handlers
    userLogRequested: (user, action) => {
      user.loading = true;
    },
    userLoggedIn: (user, action) => {
      user.data = action.payload;
      user.loading = false;
      user.active = true;
    },
    userLogFailed: (user, action) => {
      user.loading = false;
    },
    userLoggedOut: (user, action) => {
      user.active = false;
      user.data = {};
    },
    userNameUpdated: (user, action) => {
      user.data.displayName = action.payload;
      user.loading = false;
    },
    userPhotoChanged: (user, action) => {
      user.data.photoURL = action.payload;
      user.loading = false;
    },
  },
});

export const {
  userLogRequested,
  userLoggedIn,
  userLogFailed,
  userLoggedOut,
  userNameUpdated,
  userPhotoChanged,
} = slice.actions;
export default slice.reducer;

//---------- Actions ---------------

export const userLogIn = () => (dispatch) => {
  return dispatch(
    authBegan({
      onStart: userLogRequested.type,
      onSuccess: userLoggedIn.type,
      onError: userLogFailed.type,
    })
  );
};

export const readActiveUser = () => (dispatch) => {
  if (localStorage.getItem("user"))
    dispatch({
      type: userLoggedIn.type,
      payload: JSON.parse(localStorage.getItem("user")),
    });
};

export const userLogOut = () => (dispatch) => {
  return dispatch(
    authBegan({
      onStart: userLogRequested.type,
      onSuccess: userLoggedOut.type,
      onError: userLogFailed.type,
    })
  );
};

export const updateUserName = (updatedName) => (dispatch) => {
  return dispatch(
    authBegan({
      updatedName,
      onStart: userLogRequested.type,
      onSuccess: userNameUpdated.type,
      onError: userLogFailed.type,
    })
  );
};

export const changeUserPhoto = (newPhoto) => (dispatch) => {
  return dispatch(
    authBegan({
      newPhoto,
      onStart: userLogRequested.type,
      onSuccess: userPhotoChanged.type,
      onError: userLogFailed.type,
    })
  );
};

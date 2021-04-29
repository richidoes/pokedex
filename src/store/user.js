import { createSlice } from "@reduxjs/toolkit";
import { storage, db } from "../firebase";

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
      user.loading = false;
      user.data = {};
    },
    userNameUpdated: (user, action) => {
      user.data.displayName = action.payload;
      user.loading = false;
    },
    userPhotoUpdated: (user, action) => {
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
  userPhotoUpdated,
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

export const updateUserPhoto = (newPhoto) => async (dispatch, getState) => {
  const { user } = getState().entities;

  dispatch({ type: userLogRequested.type });

  try {
    //create a dir and a file name for the image to save
    const imageRef = await storage
      .ref()
      .child(user.data.email)
      .child("profile photo");

    //update image in storage
    await imageRef.put(newPhoto);
    const imageURL = await imageRef.getDownloadURL();

    //update user image
    await db.collection("users").doc(user.data.email).update({
      photoURL: imageURL,
    });

    //update store
    dispatch({
      type: userPhotoUpdated.type,
      payload: imageURL,
    });

    //update user in localStorage
    const updatedUser = {
      ...user.data,
      photoURL: imageURL,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  } catch (error) {
    console.log(error.message);

    dispatch({
      type: userLogFailed.type,
      payload: error.message,
    });
  }
};

import * as actions from "../auth";
import { auth, db, firebase, storage } from "../../firebase";

const userAuth = ({ dispatch, getState }) => (next) => async (action) => {
  if (action.type !== actions.authBegan.type) return next(action);

  next(action);

  const { onStart, onSuccess, onError, updatedName, newPhoto } = action.payload;

  if (onStart) dispatch({ type: onStart });

  if (onSuccess === "user/userLoggedIn") {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const response = await auth.signInWithPopup(provider);

      console.log(response.user);

      const user = {
        uid: response.user.uid,
        email: response.user.email,
        displayName: response.user.displayName,
        photoURL: response.user.photoURL,
      };

      const userInDB = await db.collection("users").doc(user.email).get();
      console.log(userInDB);

      if (userInDB.exists) {
        dispatch({
          type: onSuccess,
          payload: userInDB.data(),
        });

        localStorage.setItem("user", JSON.stringify(userInDB.data()));
      } else {
        await db.collection("users").doc(user.email).set(user);

        dispatch({
          type: onSuccess,
          payload: user,
        });

        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      console.log(error.message);
      dispatch({
        type: onError,
        payload: error.message,
      });
    }
  }

  if (onSuccess === "user/userLoggedOut") {
    try {
      auth.signOut();

      dispatch({
        type: onSuccess,
      });

      localStorage.removeItem("user");
    } catch (error) {
      console.log(error.message);

      dispatch({
        type: onError,
        payload: error.message,
      });
    }
  }

  if (onSuccess === "user/userNameUpdated") {
    const { user } = getState();

    try {
      await db.collection("users").doc(user.data.email).update({
        displayName: updatedName,
      });

      dispatch({
        type: onSuccess,
        payload: updatedName,
      });

      const updatedUser = { ...user.data, displayName: updatedName };
      console.log(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.log(error.message);
      dispatch({
        type: onError,
        payload: error.message,
      });
    }
  }

  if (onSuccess === "user/userPhotoChanged") {
    const { user } = getState();

    try {
      //create a dir and a file name for the image to save
      const imageRef = await storage
        .ref()
        .child(user.data.email)
        .child("profile photo");

      //update image in storage
      await imageRef.put(newPhoto);
      const imageURL = await imageRef.getDownloadURL();
      await db.collection("users").doc(user.data.email).update({
        photoURL: imageURL,
      });

      //update store
      dispatch({
        type: onSuccess,
        payload: imageURL,
      });

      const updatedUser = {
        ...user.data,
        photoURL: imageURL,
      };
      console.log(updatedUser);

      localStorage.setItem("usuario", JSON.stringify(updatedUser));
    } catch (error) {
      console.log(error.message);
      dispatch({
        type: onError,
        payload: error.message,
      });
    }
  }
};

export default userAuth;

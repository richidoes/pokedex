import * as actions from "../auth";
import { auth, db, firebase } from "../../firebase";

const userAuth = ({ dispatch, getState }) => (next) => async (action) => {
  if (action.type !== actions.authBegan.type) return next(action);

  next(action);

  const { onStart, onSuccess, onError, updatedName } = action.payload;

  if (onStart) dispatch({ type: onStart });

  if (onSuccess === "user/userLoggedIn") {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const response = await auth.signInWithPopup(provider);

      const user = {
        uid: response.user.uid,
        email: response.user.email,
        displayName: response.user.displayName,
        photoURL: response.user.photoURL,
      };

      const userInDB = await db.collection("users").doc(user.email).get();

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
    const { user } = getState().entities;

    try {
      await db.collection("users").doc(user.data.email).update({
        displayName: updatedName,
      });

      dispatch({
        type: onSuccess,
        payload: updatedName,
      });

      const updatedUser = { ...user.data, displayName: updatedName };

      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.log(error.message);
      dispatch({
        type: onError,
        payload: error.message,
      });
    }
  }

  return;
};

export default userAuth;

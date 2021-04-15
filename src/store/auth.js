import { auth, db, firebase, storage } from "../firebase";

// --------- constants --------------
const dataInicial = {
  loading: false,
  activo: false,
};

//---------- Types -----------------
const LOADING = "LOADING";
const USUARIO_ERROR = "USUARIO_ERROR";
const USUARIO_EXITO = "USUARIO_EXITO";
const CERRAR_SESION = "CERRAR_SESION";

//---------- Reducer ----------------
export default function usuarioReducer(state = dataInicial, action) {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: true };
    case USUARIO_ERROR:
      return { ...dataInicial };
    case USUARIO_EXITO:
      return { ...state, loading: false, activo: true, user: action.payload };
    case CERRAR_SESION:
      return { ...dataInicial };
    default:
      return { ...state };
  }
}

//---------- Actions ---------------

//login with google
export const ingresoUsuarioAccion = () => async (dispatch) => {
  dispatch({
    type: LOADING,
  });

  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const res = await auth.signInWithPopup(provider);

    console.log(res.user);

    const usuario = {
      uid: res.user.uid,
      email: res.user.email,
      displayName: res.user.displayName,
      photoURL: res.user.photoURL,
    };

    const usuarioDB = await db.collection("usuarios").doc(usuario.email).get();
    console.log(usuarioDB);
    if (usuarioDB.exists) {
      dispatch({
        type: USUARIO_EXITO,
        payload: usuarioDB.data(),
      });
      //save user info
      localStorage.setItem("usuario", JSON.stringify(usuarioDB.data()));
    } else {
      //If not exist user in db, save it
      await db.collection("usuarios").doc(usuario.email).set(usuario);

      dispatch({
        type: USUARIO_EXITO,
        payload: usuario,
      });
      //save user info
      localStorage.setItem("usuario", JSON.stringify(usuario));
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: USUARIO_ERROR,
    });
  }
};

//if someone is logged get his info
export const leerUsuarioActivoAccion = () => (dispatch) => {
  if (localStorage.getItem("usuario")) {
    dispatch({
      type: USUARIO_EXITO,
      payload: JSON.parse(localStorage.getItem("usuario")),
    });
  }
};

//logout
export const cerrarSesionAction = () => (dispatch) => {
  //signout in google
  auth.signOut();
  //clear user info saved
  localStorage.removeItem("usuario");

  dispatch({
    type: CERRAR_SESION,
  });
};

//update user
export const actualizarUsuarioAccion = (nombreActualizado) => async (
  dispatch,
  getState
) => {
  dispatch({
    type: LOADING,
  });

  const { user } = getState().usuario;

  try {
    //update firestore user
    await db.collection("usuarios").doc(user.email).update({
      displayName: nombreActualizado,
    });

    //get user without changes and the new change
    const usuario = {
      ...user,
      displayName: nombreActualizado,
    };
    //update store
    dispatch({
      type: USUARIO_EXITO,
      payload: usuario,
    });

    //update/set user info localstorage
    localStorage.setItem("usuario", JSON.stringify(usuario));
  } catch (error) {
    console.log(error);
  }
};

//change photo
export const editarFotoAccion = (imagenEditada) => async (
  dispatch,
  getState
) => {
  dispatch({
    type: LOADING,
  });

  const { user } = getState().usuario;

  try {
    //create a dir and a file name for the image to save
    const imagenRef = await storage
      .ref()
      .child(user.email)
      .child("foto perfil");
    //update image in storage
    await imagenRef.put(imagenEditada);
    //get url
    const imagenURL = await imagenRef.getDownloadURL();

    await db.collection("usuarios").doc(user.email).update({
      photoURL: imagenURL,
    });

    //get user without changes and the new change
    const usuario = {
      ...user,
      photoURL: imagenURL,
    };
    //update store
    dispatch({
      type: USUARIO_EXITO,
      payload: usuario,
    });
    //update/set user info localstorage
    localStorage.setItem("usuario", JSON.stringify(usuario));
  } catch (error) {
    console.log(error);
  }
};

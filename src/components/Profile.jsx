import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserName, updateUserPhoto } from "../store/user";

const Profile = () => {
  const user = useSelector((state) => state.entities.user.data);
  const loading = useSelector((state) => state.entities.user.loading);
  const dispatch = useDispatch();

  const [userName, setUserName] = React.useState(user.displayName);
  const [activeForm, setActiveForm] = React.useState(false);
  const [error, setError] = useState(false);

  const handleUpdateUser = () => {
    if (!userName.trim()) console.log("Name field must be filled");

    dispatch(updateUserName(userName));
    setActiveForm(false);
  };

  const seleccionarArchivo = (image) => {
    if (image === undefined) console.log("No image selected");

    const newImage = image.target.files[0];

    if (
      newImage.type === "image/png" ||
      newImage.type === "image/jpg" ||
      newImage.type === "image/jpeg"
    ) {
      dispatch(updateUserPhoto(newImage));
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="mt-5 text-center">
      <div className="card-body">
        <div className="card-body">
          <img src={user.photoURL} alt="" width="100px" className="img-fluid" />
          <h4 className="card-title">Name: {user.displayName}</h4>
          <h5 className="card-text">Email: {user.email}</h5>
          <button
            className="btn btn-warning"
            onClick={() => setActiveForm(true)}
          >
            Edit name
          </button>

          {error && (
            <div className="alert alert-danger mt-2">
              Only PNG,JPG,JPGEG files please...
            </div>
          )}

          <div className="custom-file">
            <input
              type="file"
              className="custom-file-input"
              id="inputGroupFile01"
              style={{ display: "none" }}
              onChange={(e) => seleccionarArchivo(e)}
              disabled={loading}
            />
            <label
              className={
                loading ? "btn btn-info mt-2 disabled" : "btn btn-info mt-2"
              }
              htmlFor="inputGroupFile01"
            >
              Update image
            </label>
          </div>

          {loading && (
            <div className="card-body">
              <div className="spinner-border text-success" role="status" />
              <span className="sr-only">Loading...</span>
            </div>
          )}

          {activeForm ? (
            <div className="card-body">
              <div className="row justify-content-center">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => handleUpdateUser()}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Profile;

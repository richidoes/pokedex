import { createAction } from "@reduxjs/toolkit";

export const authBegan = createAction("auth/Began");
export const authSuccess = createAction("auth/Success");
export const authFailed = createAction("auth/Failed");

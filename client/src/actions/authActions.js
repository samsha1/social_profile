import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

//rEGISTER uSER

export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/users/register", userData)
    .then((res) => history.push("/login"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//login User
export const loginUser = (loginData) => (dispatch) => {
  axios
    .post("/api/users/login", loginData)
    .then((res) => {
      //save to localStorage
      const { token } = res.data;
      //set token to localstorage
      localStorage.setItem("jwtToken", token);

      //set token to auth header
      setAuthToken(token);

      //decode token to get user data
      const decoded = jwt_decode(token);
      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const logoutUser = () => (dispatch) => {
  //remove localStorage
  localStorage.removeItem("jwtToken");
  //remove Authorization headers
  setAuthToken(false);

  //set current user null
  dispatch(setCurrentUser({}));
};

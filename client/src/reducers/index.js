import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducers from "./errorReducers";

export default combineReducers({
  auth: authReducer,
  errors:errorReducers

});

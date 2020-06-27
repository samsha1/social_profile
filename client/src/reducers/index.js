import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducers from "./errorReducers";
import profileReducer from "./profileReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducers,
  profile: profileReducer,
});

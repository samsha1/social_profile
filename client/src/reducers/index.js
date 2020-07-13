import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducers from "./errorReducers";
import profileReducer from "./profileReducer";
import postReducers from "./postReducers";

export default combineReducers({
  auth: authReducer,
  errors: errorReducers,
  profile: profileReducer,
  post: postReducers,
});

import axios from 'axios';
import {AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED} from "./types";
import {setAlert} from "./alert";
import setAuthToken from "../utils/setAuthToken";

export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }
  
  try {
    const res = await axios.get(`/api/auth`);
    dispatch({
      type: USER_LOADED,
      payload: res.data
    })
  } catch (e) {
    dispatch({
      type: AUTH_ERROR
    })
  }
};

export const register = ({ name, email, password, confirm_password }) => async dispatch => {
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };
  
  const body = JSON.stringify({ name, email, password, confirm_password });
  
  try {
    const res = await axios.post(`/api/auth/register`, body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    })
    
    dispatch(loadUser())
  } catch (e) {
    const errors = e.response.data.errors;
    
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    
    dispatch({
      type: REGISTER_FAIL
    })
  }
};

export const login = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }
  
  const body = JSON.stringify({ email, password });
  
  try {
    const res = await axios.post(`/api/auth/login`, body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    
    dispatch(loadUser());
  } catch (e) {
    dispatch({
      type: LOGIN_FAIL
    })
  }
};
import axios from "axios"
import {GET_PROFILE, PROFILE_ERROR} from "./types";
import {setAlert} from "./alert";

export const getAuthProfile = () => async dispatch => {
  try {
    const res = await axios.get(`/api/profile`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
};

export const createProfile = (formData, history, edit = false) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  
  try {
    const res = await axios.post(`/api/profile`, formData, config);
    
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
    
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created' + ' successfully', 'success', 3000));
    
    if (!edit) {
      history.push('/dashboard')
    }
  } catch (e) {
    const errors = e.response.data.errors;
  
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}
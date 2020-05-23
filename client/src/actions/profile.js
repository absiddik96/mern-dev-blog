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
    
    dispatch(setAlert((edit ? 'Profile Updated' : 'Profile Created') + ' successfully', 'success', 3000));
    
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
};

export const addExperience = (formData, history, exp_id = null) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  
  try {
    let res = null;
    if (exp_id) {
      res = await axios.put(`/api/profile/experience/${exp_id}`, formData, config);
    } else {
      res = await axios.post(`/api/profile/experience`, formData, config);
    }
    
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  
    if (exp_id) {
      dispatch(setAlert('Experience updated successfully', 'success', 3000));
    } else {
      dispatch(setAlert('Experience created successfully', 'success', 3000));
    }
    
    history.push('/dashboard')
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
};

export const deleteExperience = exp_id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${exp_id}`);
    
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
    
    dispatch(setAlert('Experience deleted successfully', 'success', 3000));
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
};

export const addEducation = (formData, history, edu_id = null) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  
  try {
    let res = null;
    if (edu_id) {
      res = await axios.put(`/api/profile/education/${edu_id}`, formData, config);
    } else {
      res = await axios.post(`/api/profile/education`, formData, config);
    }
    
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  
    if (edu_id) {
      dispatch(setAlert('Education updated successfully', 'success', 3000));
    } else {
      dispatch(setAlert('Education created successfully', 'success', 3000));
    }
    
    history.push('/dashboard')
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
};

export const deleteEducation = edu_id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${edu_id}`);
    
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
    
    dispatch(setAlert('Education deleted successfully', 'success', 3000));
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
};
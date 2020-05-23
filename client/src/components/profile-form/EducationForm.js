import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";

import {addEducation, getAuthProfile} from "../../actions/profile";
import {setAlert} from "../../actions/alert";
import * as moment from "moment";

const initialState = {
  degree: "",
  school: "",
  fieldofstudy: "",
  from: "",
  current: false,
  to: "",
  description: "",
};

const EducationForm = ({ addEducation, history, getAuthProfile, match, profile: { loading, profile }, setAlert }) => {
  
  const edu_id = match.params.edu_id ?? null;
  
  const [formData, setFormData] = useState(initialState);
  
  useEffect(() => {
    if (edu_id) getAuthProfile();
    if (!loading && profile && edu_id) {
      const edu = profile.education.find(edu => edu._id === edu_id);
      
      if (!edu) {
        setAlert("Education not found", "danger", 3000);
        return history.push('/dashboard')
      }
      
      let initialEdu = { ...initialState };
      
      edu.from = edu.from ? moment(edu.from).format('YYYY-MM-DD') : initialEdu.from;
      edu.to = edu.to ? moment(edu.to).format('YYYY-MM-DD') : initialEdu.to;
      
      toggleToDateDisabled(edu.current);
      
      for (const key in edu) {
        if (key in initialEdu) initialEdu[key] = edu[key];
      }
      
      setFormData(initialEdu)
    }
  }, [loading, getAuthProfile, edu_id]);
  
  const [toDateDisabled, toggleToDateDisabled] = useState(false);
  
  const { degree, school, fieldofstudy, from, current, to, description } = formData;
  
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const onSubmit = e => {
    e.preventDefault();
    addEducation(formData, history, edu_id);
  };
  return (
    <Fragment>
      <h1 className="large text-primary">
        {edu_id ? 'Update' : "Add"} Your Education
      </h1>
      <p className="lead">
        <i className="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
        you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="text" placeholder="* School or Bootcamp" name="school" value={school} onChange={e => onChange(e)} required/>
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Degree or Certificate" name="degree" value={degree} onChange={e => onChange(e)} required/>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Field Of Study" name="fieldofstudy" value={fieldofstudy} onChange={e => onChange(e)}/>
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={e => onChange(e)}/>
        </div>
        <div className="form-group">
          <p>
            <label htmlFor="current">
              <input id="current" type="checkbox" name="current" checked={current} value={current} onChange={() => {
                setFormData({ ...formData, current: !current });
                toggleToDateDisabled(!toDateDisabled)
              }}/> Current School or Bootcamp
            </label>
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange={e => onChange(e)} disabled={toDateDisabled}/>
        </div>
        <div className="form-group">
          <textarea name="description" value={description} onChange={e => onChange(e)} cols="30" rows="5" placeholder="Program Description"></textarea>
        </div>
        <button type="submit" className="btn btn-primary my-1">
          {edu_id ? 'Update' : "Submit"}
        </button>
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
    </Fragment>
  );
};

EducationForm.propTypes = {
  addEducation: PropTypes.func.isRequired,
  getAuthProfile: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { addEducation, getAuthProfile, setAlert })(withRouter(EducationForm));
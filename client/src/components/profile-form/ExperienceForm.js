import React, {Fragment, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as moment from "moment";

import {addExperience, getAuthProfile} from "../../actions/profile";
import {setAlert} from "../../actions/alert";

const initialState = {
  title: "",
  company: "",
  location: "",
  from: "",
  current: false,
  to: "",
  description: "",
};

const ExperienceForm = ({ addExperience, history, getAuthProfile, match, profile: { loading, profile }, setAlert }) => {
  
  const exp_id = match.params.exp_id ?? null;
  
  const [formData, setFormData] = useState(initialState);
  
  useEffect(() => {
    if (exp_id) getAuthProfile();
    if (!loading && profile && exp_id) {
      const exp = profile.experience.find(exp => exp._id === exp_id);
      
      if (!exp) {
        setAlert("Experience not found", "danger", 3000);
        return history.push('/dashboard')
      }
      
      let initialExp = { ...initialState };
      
      exp.from = exp.from ? moment(exp.from).format('YYYY-MM-DD') : initialExp.from;
      exp.to = exp.to ? moment(exp.to).format('YYYY-MM-DD') : initialExp.to;
  
      toggleToDateDisabled(exp.current)
      
      for (const key in exp) {
        if (key in initialExp) initialExp[key] = exp[key];
      }
      
      setFormData(initialExp)
    }
  }, [loading, getAuthProfile, exp_id]);
  
  const [toDateDisabled, toggleToDateDisabled] = useState(false);
  
  const { title, company, location, from, current, to, description } = formData;
  
  
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const onSubmit = e => {
    e.preventDefault();
    addExperience(formData, history, exp_id);
  };
  
  return (
    <Fragment>
      <h1 className="large text-primary">
        {exp_id ? 'Update' : "Add An"} Experience
      </h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="text" placeholder="* Job Title" name="title" value={title} onChange={e => onChange(e)} required/>
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Company" name="company" value={company} onChange={e => onChange(e)} required/>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Location" name="location" value={location} onChange={e => onChange(e)}/>
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={e => onChange(e)}/>
        </div>
        <div className="form-group">
          <p>
            <label htmlFor="current">
              <input id="current" type="checkbox" name="current" checked={current} value={current} onChange={e => {
                setFormData({ ...formData, current: !current });
                toggleToDateDisabled(!toDateDisabled)
              }}/> Current Job
            </label>
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange={e => onChange(e)} disabled={toDateDisabled}/>
        </div>
        <div className="form-group">
          <textarea name="description" value={description} onChange={e => onChange(e)} cols="30" rows="5" placeholder="Job Description"></textarea>
        </div>
        <button type="submit" className="btn btn-primary my-1">
          {exp_id ? 'Update' : "Submit"}
        </button>
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
    </Fragment>
  );
};

ExperienceForm.propTypes = {
  addExperience: PropTypes.func.isRequired,
  getAuthProfile: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { addExperience, getAuthProfile, setAlert })(withRouter(ExperienceForm));
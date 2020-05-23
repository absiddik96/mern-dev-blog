import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Moment from "react-moment";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import {deleteExperience} from "../../actions/profile";

const Experience = ({ experience, deleteExperience }) => {
  
  const experiences = experience.map(exp => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td>{exp.title}</td>
      <td>
        <Moment format="DD-MM-YYYY">{exp.from}</Moment> - {' '}
        {exp.to == null ? " Now" :
          <Moment format="DD-MM-YYYY">{exp.to}</Moment>
        }
      </td>
      <td>
        <Link to={`/edit-experience/${exp._id}`} className="btn btn-primary">Edit</Link>
        <button onClick={() => deleteExperience(exp._id)} className="btn btn-danger">Delete</button>
      </td>
    </tr>
  ));
  
  return (
    <Fragment>
      <h1 className="my-1">Experience credential</h1>
      <table className="table">
        <thead>
        <tr>
          <th>Company</th>
          <th className="hide-sm">Title</th>
          <th className="hide-sm">Years</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {experiences}
        </tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  deleteExperience: PropTypes.func.isRequired,
  experience: PropTypes.array.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
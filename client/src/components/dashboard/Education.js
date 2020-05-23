import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Moment from "react-moment";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import {deleteEducation} from "../../actions/profile";

const Education = ({ education, deleteEducation }) => {
  
  const educations = education.map(edu => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td>{edu.degree}</td>
      <td>
        <Moment format="DD-MM-YYYY">{edu.from}</Moment> - {' '}
        {edu.to == null ? " Now" :
          <Moment format="DD-MM-YYYY">{edu.to}</Moment>
        }
      </td>
      <td>
        <Link to={`/edit-education/${edu._id}`} className="btn btn-primary">Edit</Link>
        <button onClick={() => deleteEducation(edu._id)} className="btn btn-danger">Delete</button>
      </td>
    </tr>
  ));
  
  return (
    <Fragment>
      <h1 className="my-1">Education credential</h1>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {educations}
        </tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired,
  education: PropTypes.array.isRequired,
};

export default connect(null, { deleteEducation })(Education);